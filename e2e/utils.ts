import { execSync } from 'child_process';
import detect from "detect-port";
import {Page, expect } from "@playwright/test";

export async function setupE2eTest(){
    await startSupabase();
    reseedDb();
}

async function startSupabase() {
    const port = await detect(54322);
    if (port !== 54322){
        return;
    }
    console.warn("Supabase not detected - Starting it now");
    execSync("npx supabase start");
}

function reseedDb() {
    execSync(
        "PGPASSWORD=postgres psql -U postgres -h 127.0.0.1 -p 54322 -f supabase/clear-db-data.sql",
        { stdio: "ignore"}
    );
}

export async function signUp(
    page: Page,
    email: string,
    password: string,
    userName: string,
    skipUserName = false
) {
    const signUpButton = page.locator("button", {hasText: "S'inscrire"}).first();
    await signUpButton.click();
    const emailInput = page.locator('input[name="email"]');
    await emailInput.fill(email);
    const passwordInput = page.locator('input[name="password"]');
    await passwordInput.fill(password);
    await page.keyboard.press("Enter");
    const welcomeNotice = page.locator("h2", {hasText: "Bienvenue sur Supaship !!"});
    await expect(welcomeNotice).toHaveText("Bienvenue sur Supaship !!");
    if (skipUserName){
        return;
    }
    const usernameInput = page.locator('input[name="username"]');
    await usernameInput.fill(userName);
    const submitButton = page.locator("button", { hasText: "Envoyer"});
    await expect(submitButton).toBeEnabled();
    await page.keyboard.press("Enter");
    const logoutButton = page.locator("button", { hasText: "DECONNEXION"});
    await expect(logoutButton).toHaveCount(1);
}

export async function login(
    page: Page,
    email: string,
    password: string,
    username: string,
    loginButtonSelector = "button"
) {
    const signUpButton = page
        .locator(loginButtonSelector, { hasText: "Connexion"})
        .first();
    await signUpButton.click();
    const emailInput = page.locator('input[name="email"]');
    await emailInput.fill(email);
    const passwordInput = page.locator('input[name="password"]');
    await passwordInput.fill(password);
    await page.keyboard.press("Enter");
    const logoutButton = page.locator("button", {hasText: "Deconnexion"});
    await expect(logoutButton).toHaveCount(1);
    const usernameMention = page.locator("h2", {hasText: username});
    await expect(usernameMention).toHaveCount(1);
}

export async function createPost(page: Page, title: string, contents: string){
    page.goto("http://127.0.0.1:1337/message-board/1");
    const postTitleInput = page.locator(`input[name="title"]`)
    const postContentsInput = page.locator(`textarea[name="contents"]`);
    const postSubmitButton = page.locator(`button[type="submit"]`);
    await postTitleInput.fill(title);
    await postContentsInput.fill(contents);
    await postSubmitButton.click();
    const post = page.locator("h3", {hasText: title});
    await expect(post).toHaveCount(1);
    return post;
}

export async function createComment(page: Page, comment: string){
    const commentInput = page.locator(`textarea[name="comment"]`);
    const commentSubmitButton = page.locator(`button[type="submit"]`);
    await commentInput.fill(comment);
    await commentSubmitButton.click();
    const createdComment = page.locator("p", {hasText: comment});
    await expect(createdComment).toHaveCount(1);
}
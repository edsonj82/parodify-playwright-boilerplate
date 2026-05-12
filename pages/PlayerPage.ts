import { Page, Locator, expect } from '@playwright/test';

export class PlayerPage {
    readonly page: Page;
    readonly loggedUser: Locator;
    readonly songCard: (title: string) => Locator;

    constructor(page: Page) {
        this.page = page;
        this.loggedUser = page.locator('.logged-user');
        this.songCard = (title: string) => page.locator('.song').filter({ hasText: title });
    }

    async playSong(title: string) {
        const card = this.songCard(title);
        await card.locator('.play').click();
    }

    async verifyPauseVisible(title: string) {
        await expect(this.songCard(title).locator('.pause')).toBeVisible();
    }

    async pauseSong(title: string) {
        const card = this.songCard(title);
        await card.locator('.pause').click();
    }

    async verifyPlayVisible(title: string) {
        await expect(this.songCard(title).locator('.play')).toBeVisible();
    }

    async verifySongFinished(title: string) {
        const card = this.songCard(title);
        // 2026 Best Practice: Esperar o estado contrário desaparecer 
        // garante que a transição de UI foi concluída.
        await expect(card.locator('.pause')).toBeHidden({ timeout: 10000 });  // Espera até 5 segundos para o botão de pause desaparecer antes de verificar o play.
        await expect(card.locator('.play')).toBeVisible();
        // await expect(this.songCard(title).locator('.play')).toBeVisible();
    }
}
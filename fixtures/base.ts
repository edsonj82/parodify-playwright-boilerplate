import { test as base } from '@playwright/test';
import { PlayerPage } from '../pages/PlayerPage';

//Definimos o tipo da nossa fixture
type MyFixtures = {
    player: PlayerPage;
}

//Criamos a fixture usando o método extend do Playwright
export const test = base.extend<MyFixtures>({
    //Definimos a fixture 'player'
    player: async ({ page }, use) => {
        await page.clock.install(); // Instala o clock para controle de tempo

        const player = new PlayerPage(page);
        await use(player); // Disponibiliza a fixture para os testes

        // await page.clock.uninstall(); // Desinstala o clock após o teste
    }
});
export { expect } from '@playwright/test';

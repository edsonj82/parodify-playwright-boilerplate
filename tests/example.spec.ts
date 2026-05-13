// import { test, expect } from '@playwright/test';
// import { PlayerPage } from '../pages/PlayerPage';
import { test, expect } from '../fixtures/base';
import songs from '../fixtures/songs.json';

test.describe('Music Player', () => {
  // Definimos qual música usar nos testes (facilita a troca se necessário)
  const MOCK_SONG = songs[0];

  test('it should display a music player', async ({ page, player }) => {
    // const player = new PlayerPage(page);

    // Interceptação de API (Network Mocking)
    await page.route('**/songs', async (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([MOCK_SONG])
      });
    });

    await page.goto('/');

    // Asserção de estado inicial
    await expect(player.loggedUser).toHaveText('Fernando Papito');  // Expect the logged user to be displayed correctly.  

    // Fluxo de interação
    await player.playSong(MOCK_SONG.title);

    // Validações de estado (Play/Pause)
    await player.verifyPauseVisible(MOCK_SONG.title);  // Expect the pause button to be visible after clicking play.

    // Avança o tempo artificialmente (ex: 30 segundos)
    // Isso faz o teste ser instantâneo, mas a aplicação "acha" que o tempo passou.
    await page.clock.fastForward(30000);  // Avança o relógio em 30 segundos (30000 ms)

    await player.verifySongFinished(MOCK_SONG.title);  // Expect the play button to be visible again after some time (indicating the song has finished playing). 
  });

  test('it should allow the user to pause', async ({ page, player }) => {
    // Interceptação de API para fornecer uma música de teste
    await page.route('**/songs', async (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([MOCK_SONG])
      });
    });
    await page.goto('/');

    // Tocar a música
    await player.playSong(MOCK_SONG.title);
    await player.verifyPauseVisible(MOCK_SONG.title);
    // Pausar a música
    await player.pauseSong(MOCK_SONG.title);
    await player.verifyPlayVisible(MOCK_SONG.title);  // Expect the play button to be visible after pausing.
  });

  test('it should allow to resume paused music', async ({ page, player }) => {
    // Interceptação de API para fornecer uma música de teste
    await page.route('**/songs', async (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([MOCK_SONG])
      });
    });
    await page.goto('/');

    await player.playSong(MOCK_SONG.title);
    await player.verifyPauseVisible(MOCK_SONG.title);
    await player.pauseSong(MOCK_SONG.title);
    await player.verifyPlayVisible(MOCK_SONG.title);
    // // Retomar a música
    await player.playSong(MOCK_SONG.title);
    await player.verifyPauseVisible(MOCK_SONG.title); // Expect the pause button to be visible again after resuming. 
  });
});

test.describe('Music Player - Dynamic Suite', () => {
  // Criando testes dinamicamente para cada música no JSON
  songs.forEach((song) => {
    test(`should play and finish the song: ${song.title}`, async ({ page, player }) => {
      // Interceptamos a API com a lista completa, mas focamos na música da iteração
      await page.route('**/songs', async (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([song])
        });
      });
      await page.goto('/');

      // Validação de Identidade (Fernando Papito)
      await expect(player.loggedUser).toHaveText('Fernando Papito');  // Expect the logged user to be displayed correctly.

      // Fluxo dinâmico baseado no título da música atual do loop
      await player.playSong(song.title);
      await player.verifyPauseVisible(song.title);

      // Salto temporal para validar a conclusão
      await page.clock.fastForward(30000);
      await player.verifySongFinished(song.title);

    });
  });
});
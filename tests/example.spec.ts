// import { test, expect } from '@playwright/test';
import { test, expect } from '../fixtures/base';
// import { PlayerPage } from '../pages/PlayerPage';


test.describe('Music Player', () => {
  // Mock centralizado em uma constante para fácil manutenção
  const MOCK_SONG = {
    id: 1,
    title: "Smell Like Test Script",
    artist: "Nullvana",
    description: "Nullvana",
    image: "https://raw.githubusercontent.com/qaxperience/mock/main/covers/nevertesting.jpg",
    type: "album",
    src: "https://raw.githubusercontent.com/qaxperience/mock/main/songs/nirvana.mp3"
  };

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

    // // Retomar a música
    // await player.playSong(MOCK_SONG.title);
    // await player.verifyPauseVisible(MOCK_SONG.title);  // Expect the pause button to be visible again after resuming. 

  });
});
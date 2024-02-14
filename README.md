# livesport-wdio

This is a homework as part of the hiring process to Livesport.

## Testing strategy

For implementation of the tests I used Typescript language and Mocha framework (comes from initialising wdio) with
webdriver.io and appium.

I also decided to use PageObjects pattern for representing the screens inside the livesport app.
Each screen should have its own file and class representing them, saved
in [test/pageobjects/livesport](test/pageobjects/livesport).
There are also screen parts, for example [BottomNavigationBar](test/pageobjects/livesport/parts/) saved
in [test/pageobjects/parts/](test/pageobjects/livesport/parts) folder.

The test itself is in [test.e2e.ts](test/specs/test.e2e.ts). I tried to get rid of repetition where it made sense,
therefore extracting locators to variables. The code is commented and to more complex methods I added documentation.

I wanted to use `describe` method as test case and `it` as test steps, but after trying I realised that `it` is in fact
test case itself.
Therefore, I need to have all the test steps in one `it` block.

Other option would be to use Mocha's bail option in [wdio.conf.ts](wdio.conf.ts) `mochaOpts: { bail: true }`. That would
bail other test cases after one fail.

### Environment

As part of my work I added also support for test parameters, those are stored in [.env](.env) file, these parameters are
then parsed in [wdio.conf.ts](wdio.conf.ts) and are passed as capabilities to appium server. I chose following:

```
APPIUM_SERVER_PORT=4723
APPIUM_SERVER_URL=localhost
ANDROID_DEVICE_SERIAL=emulator-5554
APPIUM_NO_RESET=false
APPIUM_FULL_RESET=true
```

Via these the behavior of the test can be changed:

- `APPIUM_SERVER_PORT` - on which port appium is running
- `APPIUM_SERVER_URL` - on which url appium is running
- `ANDROID_DEVICE_SERIAL` - device serial which should be used
- `APPIUM_NO_RESET` - `appium:noReset` capability, can be used to control whether the application state should be
  cleared between sessions in Appium tests
- `APPIUM_FULL_RESET` - `appium:fullReset` capability, instructs Appium to fully reset the app state by uninstalling the
  app before the test session starts and then reinstalling it

### Test Results

Test results are located in [reports](reports) folder. Reports are in `junit` format (.xml) and are named in
following fasion: `results-${platformName}-${deviceName}-${timestamp}.xml`.

## Running the tests:

There are few steps that needs to be done before running these tests. It also depends on your setup.

It is assumed that machine has already installed `android emulator` and `appium server` also `Node.js` is present.

### Run the android emulator

To run the android emulator you can use Android Studios device manager or you can use appium-installer.

```shell
npx appium-installer
```

Make sure that you have Android environment variables set, if not please
follow [variables setup](https://developer.android.com/tools/variables)

### Run the appium server

For running appium server, you can use following command:

```shell
appium server -p 4723 --base-path=/wd/hub
```

If port is changed, it needs to be changed then in [.env](.env) file as well.

### Install dependencies

Install dependencies for the project. Simply do it by:

```shell
npm install
```

### Download flashscore apk

To download flashscore apk, you can simply run following commands:

```shell
mkdir -p ./apk && \
wget -O ./apk/flashscore-com.apk t.livesport.cz/android/flashscore-com.apk
```

### Run the tests

All should be prepared now, you're free to run the tests itself.
Do so by executing following command:

```shell
# Run the tests.
wdio run ./wdio.conf.ts
```

### Or as one script

Assuming that appium server and android emulator are, you can use following snippet to install dependencies, download
apk and run the test.

```shell
npm install && \
mkdir -p ./apk && \
wget -O ./apk/flashscore-com.apk t.livesport.cz/android/flashscore-com.apk && \
wdio run ./wdio.conf.ts
```

# QUESTIONS

## Reálná mobilní zařízení vs. emulátory - výhody a nevýhody

|   | Realny device                                                                                                                                                                                                                                                                                 | Emulator                                                                                                                                                                                                                                                                                                                                                                                             |
|---|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| + | Odhaleni bugu na realnem zarizeni (realne produkcni prostredi), moznost pracovat s googlePlayServices (napriklad testovat nakupy). Testovani s ostatnimi aplikacemi (vlivu ostatnich aplikaci na tu nasi). Presnost testovani vykonu aplikace a moznost testovani realnych podminek pripojeni | Rychlost, cena, jednodussi setup. Moznost mockovani stavu zarizeni (pripojeni, level baterie, etc.). Moznost root pristupu (po uprave devicu).                                                                                                                                                                                                                                                       |
| - | Porizovaci a provozni cena, udrzba farmy je velice casove nakladna. Moznost flaky testu z duvodu zasahu operacniho systemu, ostatich aplikaci, pripojeni, atd.                                                                                                                                | Moznost neodhaleni chyb, ktere se vyskytuji pouzi na realnem zarizeni, ci zarizeni specifickem pro jednoho vyrobce (nemoznost reprodukce bugu). Napriklad v minulosti dochazelo k chybam na zarizenich Xiaomi a HUIAWEI kvuli power managementu. Celkem slozite nastavovani google play services a prihlasovani google a jinych uctu. Omezeni hardwaru, napriklad nemoznost jednodusse pouzit kameru |

## Jak pomocí capabilities nastartovat nainstalovanou aplikaci, nainstalovat aplikaci a jak uvést nainstalovanou aplikaci do výchozího stavu

1. Nastartovat nainstalovanou aplikaci:

- Nastartovat nainstalovanou aplikaci muzeme pomoci parameteru `appPackage` a `appActivity`, napriklad:
- `"appium:appPackage": "eu.livesport.FlashScore_com_plus"`
- `"appium:appActivity": "eu.livesport.LiveSport_cz.config.core.DefaultLauncher"}`

2. Nainstalovat aplikaci

- Aplikaci lze nainstalovat pomoci parameteru "app", napriklad v tomto testu je pouzito:
  ```'appium:app': ./apk/flashscore-com.apk```

## Předání proměnné do testu - například platforma (ios/android) apod.

Predat promennou do testu lze vice zpusoby, ja jsem zvolil environment promenne. Pouzivam k tomu [.env](.env)
soubor, kdy pak v [wdio.conf.ts](wdio.conf.ts) k promennym pristupuji pomoici `process.env`.
Timto zpusobem by slo i zmenit capabilities pro pouziti iOS zarizeni.

Dalsim zpusobem by bylo specifikovani environment parameteru primo pred spustenim prikazu.
Napriklad: `MY_PARAM=myValue wdio run ./wdio.conf.ts`.

Dalsim zpusobem muze byt cteni jakehokoliv config souboru v ramci testu nebo ve wdio configu. Timto zpusovem se pak muze
pred spustenim v CI nahradit cely obsah souboru.

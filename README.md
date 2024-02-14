# livesport-wdio

This is a homework as part of the hiring process to Livesport.

## Set Android environment variables

## Setup Android emulator

If not already in place, you'll need to set up android emulator. You can do this by:

```shell
npx appium-installer
```

This tool will also help you launch your android emulator if you don't want to use Android Studio's device manager.

# Test

## Testing strategy

For implementation of the tests I used Typescript language and Mocha framework (comes from initialising wdio) with
webdriver.io and appium.
I also decided to use PageObjects pattern for representing the screens inside the livesport app.
Each screen should have its own file and class representing them, saved
in [test/pageobjects/livesport](test/pageobjects/livesport)
There are also screen parts, for example [BottomNavigationBar](test/pageobjects/livesport/parts/) saved
in [test/pageobjects/parts/](test/pageobjects/livesport/parts) folder.

The test itself is in [test.e2e.ts](test/specs/test.e2e.ts). It contains one testcase (`describe` method) as described
in the assignment.
The testcase is distributed into test steps per assignment by using `it` methods.

### Environment

As part of my work I added also support for test parameters, those are stored in [.env](.env) file, these parameter are
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

Test results are located in [reports](reports) folder. Reports are in `junit` and are named in
format `results-${platformName}-${deviceName}-${timestamp}.xml`.

# Running the tests:

There are few steps that needs to be done before running these tests. It also depends on your setup.

It is assumed that machine has already installed android emulator and appium server.

## Run the android emulator

To run the android emulator you can use Android Studios device manager or you can use

```shell
npx appium-installer
```

## Run the appium server

For running appium server, you can use following command:

```shell
appium server -p 4723 --base-path=/wd/hub
```

If port is changed, it needs to be changed then in [.env](.env) file as well.

## Install dependencies

Install dependencies for the project. Simply do it by:

```shell
npm install
```

## Download flashscore apk

To download flashscore apk, you can simply run following commands:

```shell
mkdir -p ./apk && \
wget -O ./apk/flashscore-com.apk t.livesport.cz/android/flashscore-com.apk
```

## Run the tests

All should be prepared now, you're free to run the tests itself.
Do so by executing following command:

```shell
# Run the tests.
wdio run ./wdio.conf.ts
```

## Or as one script

Assuming that appium server and android emulator are, you can use following snippet to install dependencies, download
apk and run the test.

```shell
# Install dependencies
npm install && \
# Create apk folder and download flashscore apk.
mkdir -p ./apk && \
wget -O ./apk/flashscore-com.apk t.livesport.cz/android/flashscore-com.apk && \

# Run the tests.
wdio run ./wdio.conf.ts
```

# QUESTIONS

## Reálná mobilní zařízení vs. emulátory - výhody a nevýhody

|   | Realny device                                                                                                                                                                                             | Emulator                                                                                                                                                                                                            |
|---|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| + | Odhaleni bugu na realnem zarizeni (realne produkcni prostredi), moznost pracovat s googlePlayServices (napriklad testovat nakupy). Testovani s ostatnimi aplikacemi (vlivu ostatnich aplikaci na tu nasi) | Rychlost, cena, jednodussi setup.                                                                                                                                                                                   |
| - | Porizovaci a provozni cena, udrzba farmy je velice casove nakladna. Moznost flaky testu z duvodu zasahu operacniho systemu, ostatich aplikaci, pripojeni, atd.                                            | Moznost neodhaleni chyb, ktere se vyskytuji pouzi na realnem zarizeni, ci zarizeni specifickem pro jednoho vyrobce. Napriklad v minulosti dochazelo k chybam na zarizenich XIOAMI a HUIAWEI kvuli power managementu |

## Jak pomocí capabilities nastartovat nainstalovanou aplikaci, nainstalovat aplikaci a jak uvést nainstalovanou aplikaci do výchozího stavu

1. Nastartovat nainstalovanou aplikaci:
  - Nastartovat nainstalovanou aplikaci muzeme pomoci parameteru `appPackage` a `appActivity`, napriklad:
  - `"appium:appPackage": "eu.livesport.FlashScore_com_plus"`
  - `"appium:appActivity": "eu.livesport.LiveSport_cz.config.core.DefaultLauncher"}`
2. Nainstalovat aplikaci
  - Aplikaci lze nainstalovat pomoci parameteru "app", napriklad v tomto testu je pouzito:
    ```'appium:app': ./apk/flashscore-com.apk```
  - 

## Předání proměnné do testu - například platforma (ios/android) apod.
Predat promennou do testu lze vice zpusoby, ja jsem zvolil sestu environment promennych. Pouzivam k tomu [.env](.env) soubor, kdy pak v [wdio.conf.ts](wdio.conf.ts) k promennym pristupuji pomoici `process.env`.
Timto zpusobem by slo i zmenit capabilities pro pouziti iOS zarizeni.

Dalsim zpusobem by bylo specifikovani environment parameteru primo pred spustenim prikazu. Napriklad: `MY_PARAM=myValue wdio run ./wdio.conf.ts`.

Dalsim zpusobem muze byt cteni jineho config souboru v ramci testu nebo ve wdio configu.

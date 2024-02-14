import type {Options} from '@wdio/types'

const port: number = process.env.APPIUM_SERVER_PORT === undefined ? 4723 : parseInt(process.env.APPIUM_SERVER_PORT)
const hostname: string = process.env.APPIUM_SERVER_URL === undefined ? "localhost" : process.env.APPIUM_SERVER_URL
const androidDeviceSerial: string = process.env.ANDROID_DEVICE_SERIAL === undefined ? "emulator-5554" : process.env.ANDROID_DEVICE_SERIAL
const noReset: boolean = process.env.APPIUM_NO_RESET === undefined ? false : process.env.APPIUM_NO_RESET === "true"
const fullReset: boolean = process.env.APPIUM_FULL_RESET === undefined ? true : process.env.APPIUM_FULL_RESET === "true"

function outputFileFormat(options: any, extension: string) { // options is an object containing test details
    const {capabilities} = options;
    const platformName = capabilities.platformName || 'platform';
    const deviceName = capabilities['appium:udid'] || 'udid';

    const date = new Date();
    const timestamp = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;

    return `results-${platformName}-${deviceName}-${timestamp}.${extension}`;
};

export const config: Options.Testrunner = {
    //
    // ====================
    // Runner Configuration
    // ====================
    // WebdriverIO supports running e2e tests as well as unit and component tests.
    runner: 'local',
    autoCompileOpts: {
        autoCompile: true,
        tsNodeOpts: {
            project: './tsconfig.json',
            transpileOnly: true
        }
    },
    hostname: hostname,
    port: port,
    path: '/wd/hub',
    //
    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the directory
    // of the configuration file being run.
    //
    // The specs are defined as an array of spec files (optionally using wildcards
    // that will be expanded). The test for each spec file will be run in a separate
    // worker process. In order to have a group of spec files run in the same worker
    // process simply enclose them in an array within the specs array.
    //
    // The path of the spec files will be resolved relative from the directory of
    // of the config file unless it's absolute.
    //
    specs: [
        './test/specs/**/*.ts'
    ],
    // Patterns to exclude.
    exclude: [
        // 'path/to/excluded/files'
    ],

    maxInstances: 10,
    capabilities: [{
        // capabilities for local Appium web tests on an Android Emulator
        platformName: 'Android',

        'appium:udid': androidDeviceSerial,
        'appium:deviceName': "Android GoogleAPI Emulator",

        // App installation
        'appium:app': `${process.cwd()}/apk/flashscore-com.apk`, // Full path to the APK file you want to test

        //Should be needed only for already installed app
        "appium:appPackage": "eu.livesport.FlashScore_com_plus",
        "appium:appActivity": "eu.livesport.LiveSport_cz.config.core.DefaultLauncher",

        // For cases when permission needs to be added
        'appium:autoGrantPermissions': true,

        // Reset app to the default state, all tests start from the begining.
        "appium:noReset": noReset,
        // Full reset will delete and install app again.
        "appium:fullReset": fullReset,

        'appium:automationName': "UiAutomator2",
    }],

    //
    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: 'info',
    //
    // Set specific log levels per logger
    // loggers:
    // - webdriver, webdriverio
    // - @wdio/browserstack-service, @wdio/devtools-service, @wdio/sauce-service
    // - @wdio/mocha-framework, @wdio/jasmine-framework
    // - @wdio/local-runner
    // - @wdio/sumologic-reporter
    // - @wdio/cli, @wdio/config, @wdio/utils
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    // logLevels: {
    //     webdriver: 'info',
    //     '@wdio/appium-service': 'info'
    // },
    //
    // If you only want to run your tests until a specific amount of tests have failed use
    // bail (default is 0 - don't bail, run all tests).
    bail: 0,
    //
    // Set a base URL in order to shorten url command calls. If your `url` parameter starts
    // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
    // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
    // gets prepended directly.
    baseUrl: '',
    //
    // Default timeout for all waitFor* commands.
    waitforTimeout: 10000,
    //
    // Default timeout in milliseconds for request
    // if browser driver or grid doesn't send response
    connectionRetryTimeout: 120000,
    //
    // Default request retries count
    connectionRetryCount: 3,

    // TODO: Removed for already running appium
    // services: ['appium'],

    // Framework you want to run your specs with.
    // The following are supported: Mocha, Jasmine, and Cucumber
    // see also: https://webdriver.io/docs/frameworks
    //
    // Make sure you have the wdio adapter package for the specific framework installed
    // before running any tests.
    framework: 'mocha',
    reporters: [
        'spec',
        ['junit', {
            outputDir: './reports/junit',
            outputFileFormat: function (options) {
                return outputFileFormat(options, "xml")
            }
        }]
    ],

    // Options to be passed to Mocha.
    // See the full list at http://mochajs.org/
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000,
        // Can be used for bailing test cases after one fails.
        //bail: true,
    }
}

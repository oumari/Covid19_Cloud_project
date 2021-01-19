// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  covid_api: 'https://api.covid19api.com/',  
  firebaseConfig: {
    apiKey: "AIzaSyDxmwuR5LA0A7eADCtfp_09UwcVxAlTewM",
    authDomain: "covid-19-61b7a.firebaseapp.com",
    projectId: "covid-19-61b7a",
    storageBucket: "covid-19-61b7a.appspot.com",
    messagingSenderId: "141351277770",
    appId: "1:141351277770:web:332106a371487c91bf1033"
  }
};

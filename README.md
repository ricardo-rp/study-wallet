This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Relevant technical decisions

React context was not used extensively as there is little need for global state that can't be satisifed with url params.

Context is used extensively in the `/exchange` route to abstract complex logic away from the UI layer.

Various OS-specific adaptations were made inside the `/exchange` route to accomodate for ios UI behaviour.

React-query was used to facilitate data-fetching in most pages.

Reducer pattern was used isntead of react query inside the `exchange` context for easier management of multiple synchronous state updates and complex behaviour.


## Running the project

1. Install dependencies

   ```bash
   pnpm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

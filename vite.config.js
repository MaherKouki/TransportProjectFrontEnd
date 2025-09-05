// import { defineConfig } from 'vite';
// import angular from '@analogjs/vite-plugin-angular';

// export default defineConfig({
//   plugins: [angular()],
//   server: {
//     host: true,
//     port: 4200,
//     // Autoriser ton URL ngrok
//     allowedHosts: "all"
//   }
// });



import { defineConfig } from 'vite';
import { ng } from '@angular/cli/plugins/vite'; // selon ta config

export default defineConfig({
  plugins: [ng()],
  server: {
    host: true, // pour écouter toutes les interfaces
    port: 4200,
    allowedHosts: [
      '9d315def5abf.ngrok-free.app',
      'localhost',
      '127.0.0.1'
    ],
  },
});

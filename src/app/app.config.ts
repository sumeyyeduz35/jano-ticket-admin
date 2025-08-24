// Bu dosya, Angular uygulamasının başlangıç (bootstrap) ayarlarını ve servis sağlayıcılarını tanımlar.
import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { ConfigService } from './services/config.service';

//---------------------------------------------------------------

//Uygulama başlamadan önce ConfigService içinden ayarları yükler
function initConfig(cfg: ConfigService) {
  return () => cfg.load(); // Promise<void> döner, bootstrap bu islemi bekler
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),  //router yapılandırması
    provideHttpClient(),    //HttpClient sağlama

    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [ConfigService],
      multi: true
    }
  ]
};

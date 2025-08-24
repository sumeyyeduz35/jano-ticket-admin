// Bu servis, uygulama başlamadan önce assets/config.json dosyasından base URL bilgisini yükler.
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

//---------------------------------------------------------

export type AppConfig = {
  serviceURL: string;
};

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private _config?: AppConfig;

  constructor(private http: HttpClient) {}

  /** Uygulama boot etmeden önce 1 kez çağrılacak */
  load(): Promise<void> {
    return firstValueFrom(this.http.get<AppConfig>('assets/config.json'))
      .then(cfg => {
        if (!cfg?.serviceURL) {
          throw new Error('config.json geçersiz: "serviceURL" bulunamadı.');
        }
        // sondaki slash’ları temizle (çift // olmasın)
        this._config = { serviceURL: cfg.serviceURL.replace(/\/+$/, '') };
      });
  }

  /** Servislerden kullanacağımız base URL */
  get serviceURL(): string {
    if (!this._config) {
      throw new Error('Config henüz yüklenmedi (APP_INITIALIZER ile load() çağrılmalı).');
    }
    return this._config.serviceURL;
  }
}

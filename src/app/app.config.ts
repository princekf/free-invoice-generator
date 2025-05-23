import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core'; // ✅ Add this
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { routes } from './app.routes';
import { CountryEffects } from './components/invoice/store/effects/country.effects';
import { CurrencyEffects } from './components/invoice/store/effects/currency.effects';
import { countryReducer } from './components/invoice/store/reducer/country.reducer';
import { currencyReducer } from './components/invoice/store/reducer/currency.reducer';
import { organizationReducer } from './components/invoice/store/reducer/organization.reducer';
import { customerReducer } from './components/invoice/store/reducer/customer.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore({
      country: countryReducer,
      currency: currencyReducer,
      organization: organizationReducer,
      customer: customerReducer
    }),
    provideEffects([CountryEffects, CurrencyEffects]),
    provideNativeDateAdapter()
  ]
};

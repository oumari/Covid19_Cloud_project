import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  covid_api = environment.covid_api;

  constructor(
    private http: HttpClient
  ) { }

  getFromCovidApi(fullUrl): Promise<any> {
    return (this.http.get<any>(this.covid_api + fullUrl)).toPromise()
  }

}

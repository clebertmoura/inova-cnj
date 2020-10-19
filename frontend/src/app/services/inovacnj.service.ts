import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError as observableThrowError, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InovaCnjService {

  private url = '/api/';

  constructor(protected http: HttpClient) {
  }

  /**
   * Retorna uma coleção de valores do enumerator informado.
   * @param enumType tipo do enum
   */
  public consultarCep(cep: string): Observable<any> {
    const consultaCepUrl = this.url + `?cep=${cep}`;
    return this.http.get<any>(consultaCepUrl)
      .pipe(
        catchError(() => of(null))
      );
  }

  // sample method from angular doc
  protected handleError(httpError: HttpErrorResponse) {
    console.error('Ocorreu erro na requisição:', httpError);
    if (httpError.status >= 401 && httpError.status <= 403) {
        window.location.href = '/';
    }
    return observableThrowError(httpError);
  }

}

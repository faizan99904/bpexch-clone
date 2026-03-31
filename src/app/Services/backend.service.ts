import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CONFIG } from "../../../config";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) { }

  // Login
  login(loginData: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(CONFIG.login, loginData);
  }

  getIpInfo(): Observable<any> {
    return this.http.get<any>('https://ipinfo.io/?token=4917235be334b4');
  }

  logout(): Observable<any> {
    return this.http.post<any>(CONFIG.logout, null);
  }

  // users
  createUser(req: any): Observable<any> {
    return this.http.post<any>(CONFIG.createUser, req);
  }

  updateUser(userId: string, payload: any): Observable<any> {
    return this.http.put<any>(`${CONFIG.updateUser}/${userId}`, payload);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${CONFIG.deleteUser}/${userId}`);
  }

  getWalletBalance(): Observable<any> {
    return this.http.post<any>(CONFIG.userBalance, {});
  }

  getAllDeletedUsersList(): Observable<any> {
    return this.http.post<any>(CONFIG.getAllDeletedUsers, {});
  }
  restoreUser(userId: string): Observable<any> {
    return this.http.post<any>(`${CONFIG.restoreDeletedUser}/${userId}`, {});
  }
  changePassword(req: any): Observable<any> {
    return this.http.post<any>(`${CONFIG.changePasswordByParent}`, req);
  }
  changeUserPassword(req: any): Observable<any> {
    return this.http.post(CONFIG.changePasswordByUser, req);
  }
  getUserProfile(userId: string): Observable<any> {
    return this.http.post<any>(CONFIG.getUserProfile, { userId });
  }


  // Deposit/Withdraw
  depositAmount(userId: string, amount: number, remarks: string): Observable<any> {
    return this.http.post<any>(`${CONFIG.depositBalance}/${userId}`, { userId, amount, remarks });
  }

  withdrawAmount(userId: string, amount: number, remarks: string): Observable<any> {
    return this.http.post<any>(`${CONFIG.withdrawBalance}/${userId}`, { amount, remarks });
  }

  // Rounds
  getRoundById(roundId: string): Observable<any> {
    return this.http.post<any>(`${CONFIG.roundDetails}/${roundId}`, {});
  }
  betSattlement(roundId: string): Observable<any> {
    return this.http.post<any>(CONFIG.betSattlement, { roundId });
  }


  // Stats
  getAllStats(): Observable<any> {
    return this.http.post<any>(CONFIG.allStats, {});
  }

  // Banks
  addBank(bankData: any): Observable<any> {
    return this.http.post<any>(CONFIG.addBank, bankData);
  }
  updateBankDetails(userId: string, payload: any): Observable<any> {
    return this.http.post<any>(`${CONFIG.updateBankDetails}/${userId}`, payload);
  }

  // D/W
  updateRequestDwStatus(req: any): Observable<any> {
    return this.http.post<any>(CONFIG.updateRequestDW, req)
  }

  maintenance(): Observable<any> {
    return this.http.get<any>(CONFIG.maintenance)
  }

  maintenancePost(req: any): Observable<any> {
    return this.http.patch<any>(CONFIG.maintenance, req)
  }

  // Multiplayer
  getMultiplayer(): Observable<any> {
    return this.http.get<any>(CONFIG.getMultiplayer);
  }
  addMultiplayer(settings: any): Observable<any> {
    return this.http.post<any>(CONFIG.addMultiplayer, settings);
  }
  deleteMultiplier(multiplierId: string): Observable<any> {
    return this.http.delete<any>(`${CONFIG.deleteMultiplier}${multiplierId}`);
  }


}

import {Injectable, signal} from '@angular/core';
import {Employee} from "./employee";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    employees$ = signal<Employee[]>([]);
    employee$ = signal<Employee>({} as Employee);
    private url = 'http://107.21.85.69';

    constructor(private httpClient: HttpClient) {
    }

    getEmployees() {
        this.refreshEmployees();
        return this.employees$;
    }

    getEmployee(id: string) {
        this.httpClient.get<Employee>(`${this.url}/employees/${id}`).subscribe(employee => {
            this.employee$.set(employee);
            return this.employee$;
        });
    }

    createEmployee(employee: Employee) {
        return this.httpClient.post(`${this.url}/employees`, employee, {responseType: 'text'});
    }

    updateEmployee(id: string, employee: Employee) {
        return this.httpClient.put(`${this.url}/employees/${id}`, employee, {responseType: 'text'});
    }

    deleteEmployee(id: string) {
        return this.httpClient.delete(`${this.url}/employees/${id}`, {responseType: 'text'});
    }

    private refreshEmployees() {
        this.httpClient.get<Employee[]>(`${this.url}/employees`).subscribe(employees => {
            this.employees$.set(employees);
        });
    }
}

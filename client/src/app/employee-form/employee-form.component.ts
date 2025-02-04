import {Component, effect, EventEmitter, input, Output} from '@angular/core';
import {Employee} from "../employee";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatRadioModule} from "@angular/material/radio";
import {MatButtonModule} from "@angular/material/button";

@Component({
    selector: 'app-employee-form',
    imports: [ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatButtonModule],
    template: `
        <form class="employee-form" autocomplete="off" [formGroup]="employeeForm" (submit)="submitForm()">
            <mat-form-field>
                <mat-label>Name</mat-label>
                <input matInput placeholder="Name" formControlName="name" required/>
                @if (name?.invalid) {
                    <mat-error>Name must be at least 3 characters long.</mat-error>
                }
            </mat-form-field>

            <mat-form-field>
                <mat-label>Position</mat-label>
                <input matInput placeholder="Position" formControlName="position" required/>
                @if (position?.invalid) {
                    <mat-error>Position must be at least 5 characters long.</mat-error>
                }
            </mat-form-field>

            <mat-radio-group formControlName="level" aria-label="Select an option">
                <mat-radio-button name="level" value="junior" required>Junior</mat-radio-button>
                <mat-radio-button name="level" value="mid" required>Mid</mat-radio-button>
                <mat-radio-button name="level" value="senior" required>Senior</mat-radio-button>
            </mat-radio-group>

            <br/>

            <button mat-raised-button color="primary" type="submit" [disabled]="employeeForm.invalid">
                {{ isEditMode() ? 'Edit' : 'Add' }}
            </button>
        </form>
    `,
    styles: `
        .employee-form {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            padding: 2rem;
        }
    `
})
export class EmployeeFormComponent {
    initialState = input<Employee>();

    @Output()
    formValuesChanged = new EventEmitter<Employee>();

    @Output()
    formSubmitted = new EventEmitter<Employee>();

    employeeForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {
        this.employeeForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            position: ['', [Validators.required, Validators.minLength(5)]],
            level: ['junior', Validators.required],
        });

        effect(() => {
            this.employeeForm.setValue({
                name: this.initialState()?.name || '',
                position: this.initialState()?.position || '',
                level: this.initialState()?.level || 'junior',
            });
        });
    }

    get name() {
        return this.employeeForm.get('name');
    }

    get position() {
        return this.employeeForm.get('position');
    }

    get level() {
        return this.employeeForm.get('level');
    }

    submitForm() {
        this.formSubmitted.emit(this.employeeForm.value as Employee);
    }

    isEditMode(): boolean {
        return !!this.initialState();
    }
}

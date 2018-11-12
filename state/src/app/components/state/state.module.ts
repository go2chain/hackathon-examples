import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StateComponent} from './state.component';
import {RouterModule} from '@angular/router';
import {
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatOptionModule,
    MatSnackBarModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { FormsModule } from '@angular/forms';
import { ChangeStateComponent } from '../dialogs/change-state/change-state.component';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatOptionModule,
        MatSnackBarModule,
        MatDialogModule,
        RouterModule,
        FormsModule
    ],
    entryComponents: [ChangeStateComponent],
    declarations: [StateComponent, ChangeStateComponent],
    exports: [StateComponent, ChangeStateComponent]
})
export class StateModule {
}

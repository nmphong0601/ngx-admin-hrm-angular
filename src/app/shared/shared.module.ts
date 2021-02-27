import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner/spinner.component';
import { ModalAnimationComponent } from './modal-animation/modal-animation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteComponent } from './auto-complete/auto-complete.component';
import { NbListModule, NbInputModule, NbCardModule, NbIconModule } from '@nebular/theme';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from '../services/interceptor/interceptor.service';

@NgModule({
  declarations: [
    SpinnerComponent,
    ModalAnimationComponent,
    AutoCompleteComponent,
    AutoCompleteComponent,
  ],
  imports: [
    CommonModule,
    NbListModule,
    NbInputModule,
    NbCardModule,
    NbIconModule
  ],
  exports: [
    SpinnerComponent,
    ModalAnimationComponent,
    AutoCompleteComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {}

import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private messageService = inject(MessageService)
  
  error(detail: string, summary = "Error"){
    this.messageService.add({severity: "error", summary,detail})
  }

  success(detail: string, summary = "Uspeeech!"){
    this.messageService.add({severity: "success",summary,detail})
  }
}

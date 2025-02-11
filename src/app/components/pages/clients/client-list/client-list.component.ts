import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FirebaseService } from '../../../../services/firebase.service';
import { RouterLink } from '@angular/router';
import { PseudoauthService } from '../../../../services/pseudoauth.service';

@Component({
  selector: 'app-client-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css'
})

export class ClientListComponent {
  uid: string | undefined;
  id: string | undefined;
  
  constructor( firebaseServide: PseudoauthService ) {}
  
}

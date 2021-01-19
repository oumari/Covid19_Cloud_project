import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FgoogleService } from 'app/service/fgoogle.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    public fgoogleService: FgoogleService,
    private router: Router,
  ) { }

  ngOnInit() {
    let user = localStorage.getItem('user')
    if (user != undefined) {
      this.router.navigateByUrl('home')
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FgoogleService } from 'app/service/fgoogle.service';
import { HttpService } from 'app/service/http.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  countries = [];
  public newsForm = new FormGroup({
    country: new FormControl(''),
    description: new FormControl(''),
    new_cases: new FormControl(''),
    new_recovered: new FormControl(''),
    new_deaths: new FormControl(''),
  });
  is_loaded = false;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpService,
    private fgoogle : FgoogleService
  ) { }

  async ngOnInit() {
    this.newsForm = this.formBuilder.group({
      country: ['', Validators.required],
      description: ['Aa', Validators.pattern('[a-zA-Z ]*')],
      new_cases: ['0', Validators.pattern('[0-9]*')],
      new_recovered: ['0', Validators.pattern('[0-9]*')],
      new_deaths: ['0', Validators.pattern('[0-9]*')],
    });

    this.countries.push("Worldwide")
    this.http.getFromCovidApi('countries').then((x) => {
      x.forEach(element => {
        this.countries.push(element.Slug);
      });
    }).then(() => {
      this.is_loaded = true;
    })
  }

  get f() { return this.newsForm.controls; }

  async onSubmit() {
    this.submitted = true;
    this.loading = true;


    // stop here if form is invalid
    if (this.newsForm.invalid) {
      return;
    }

    this.fgoogle.add_news(localStorage.getItem('user'), this.f.country.value, this.f.description.value, this.f.new_cases.value, this.f.new_recovered.value, this.f.new_deaths.value).then((x) => {
      this.loading = false;
    }).catch(err => {
      this.loading = false
    })



  }

}

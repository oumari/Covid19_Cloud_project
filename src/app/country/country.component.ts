import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogNotconnectedComponent } from 'app/home/dialog-notconnected/dialog-notconnected.component';
import { DialogComponent } from 'app/home/dialog/dialog.component';
import { FgoogleService } from 'app/service/fgoogle.service';
import { HttpService } from 'app/service/http.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Color, Label, SingleDataSet } from 'ng2-charts';
import { LocalDataSource } from 'ng2-smart-table';


@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {

  data: any;
  today = new Date();
  from: any;
  to: any;
  days = [];
  lc_days = []
  country = this.route.snapshot.paramMap.get('country').toLowerCase();
  confirmed = [];
  deaths = [];
  recovered = [];
  is_loaded = false;
  lc_confirmed = [];
  lc_deaths = [];
  lc_recovered = [];
  flag: any;
  country_code: any;
  news: any
  has_news = false;
  lowValue: number = 0;
  highValue: number = 1;
  pageIndex: number = 0;
  pageSize: number = 1;

  // PIE CHART SETTINGS 
  pieChartLabels: Label[];
  pieChartData: SingleDataSet;
  pieChartOptions: ChartOptions;
  pieChartType: ChartType;
  pieChartLegend: boolean;
  pieChartPlugins: any;


  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [];

  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions) = {
    responsive: true,
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];
  source: LocalDataSource;
  user: any;
  constructor(private http: HttpService,
    private route: ActivatedRoute,
    private fgoogle: FgoogleService,
    private router: Router,
    public dialog: MatDialog,
  ) {

  }

  async ngOnInit() {
    this.user = await JSON.parse(localStorage.getItem("user"))

    // GET NEWS
    this.news = await this.fgoogle.get_news(this.country.charAt(0).toUpperCase() + this.country.slice(1))
    if (this.news != undefined) {
      this.has_news = true;
    } else {
      this.has_news = false;
    }

    // GET FLAG
    let x = await this.http.getFromCovidApi('countries')
    await x.forEach(element => {
      if (this.country.toUpperCase() == element.Country.toUpperCase()) {
        this.country_code = element.ISO2.toLowerCase();
      }
    });
    this.flag = 'https://www.countryflags.io/' + this.country_code + '/shiny/64.png'

    // DATE STRUCTURE FOR 7 DAYS 
    for (var index = 6; index >= 0; index = index - 1) {
      let day = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - index);
      let month: Number = Number(day.getMonth()) + 1
      this.days.push(day.getDate() + '/' + month);
      if (index === 0) {
        this.to = day.toISOString()
      }
      if (index === 6) {
        this.from = day.toISOString();
      }
    };

    this.barChartLabels = this.days;

    // BAR CHART
    await this.http.getFromCovidApi("country/" + this.country + "/status/confirmed/live?from=" + this.from + "&to=" + this.to).then((x) => {
      x.forEach(element => {
        this.confirmed.push(element.Cases)
      });
    })
    this.barChartData.push({
      data: this.confirmed, label: 'Total confirmed'
    })

    await this.http.getFromCovidApi("country/" + this.country + "/status/recovered/live?from=" + this.from + "&to=" + this.to).then((x) => {
      x.forEach(element => {
        this.recovered.push(element.Cases)
      });
    })
    this.barChartData.push({
      data: this.recovered, label: 'Total new recovered'
    })


    await this.http.getFromCovidApi("country/" + this.country + "/status/deaths/live?from=" + this.from + "&to=" + this.to).then((x) => {
      x.forEach(element => {
        this.deaths.push(element.Cases)
      });
    })
    this.barChartData.push({
      data: this.deaths, label: 'Total new deaths'
    })

    // LINE CHART 
    await this.http.getFromCovidApi("country/" + this.country).then((x) => {
      x.forEach(element => {
        this.lc_confirmed.push(element.Confirmed);
        this.lc_recovered.push(element.Recovered);
        this.lc_deaths.push(element.Deaths);
        let date = new Date(element.Date)
        let month = date.getMonth() + 1;
        this.lc_days.push(date.getDate() + '/' + month);
      });
    })

    this.lineChartData.push({
      data: this.lc_confirmed, label: 'All confirmed',
    },
      {
        data: this.lc_recovered, label: 'All recovered',
      },
      {
        data: this.lc_deaths, label: 'All deaths',
      })
    this.lineChartLabels = this.lc_days;

    // SUMMARY DATA 
    await this.http.getFromCovidApi("summary").then(x => {
      for (let element of x['Countries']) {
        if (element.Country == this.route.snapshot.paramMap.get('country')) {
          this.data = element;
          this.fgoogle.save_country_data(element.Country, this.data)
        }
      };
    }).then(y => {
      this.pieChartOptions = {
        responsive: true,
      };
      this.pieChartLabels = [['Active'], ['Recovered'], ['Dead']];
      this.pieChartData = [(this.data['TotalConfirmed'] - this.data['TotalDeaths']) * 100 / this.data['TotalConfirmed'] - this.data['TotalRecovered'] * 100 / this.data['TotalConfirmed'], this.data['TotalRecovered'] * 100 / this.data['TotalConfirmed'], this.data['TotalDeaths'] * 100 / this.data['TotalConfirmed']];
      this.pieChartType = 'pie';
      this.pieChartLegend = true;
      this.pieChartPlugins = [];
    })

    this.is_loaded = true

  }

  toNews() {
    if (this.user != undefined) {
      if (this.user.can_add) {
        this.router.navigateByUrl('news')
      }
      else {
        this.dialog.open(DialogComponent)
      }

    }
    else {
      this.dialog.open(DialogNotconnectedComponent)
    }

  }

  getPaginatorData(event) {
    if (event.pageIndex === this.pageIndex + 1) {
      this.lowValue = this.lowValue + this.pageSize;
      this.highValue = this.highValue + this.pageSize;
    }
    else if (event.pageIndex === this.pageIndex - 1) {
      this.lowValue = this.lowValue - this.pageSize;
      this.highValue = this.highValue - this.pageSize;
    }
    this.pageIndex = event.pageIndex;
  }
}

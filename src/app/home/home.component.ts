import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'app/service/http.service';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { SingleDataSet, Label, Color } from 'ng2-charts';
import { LocalDataSource } from 'ng2-smart-table';
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from './dialog/dialog.component';
import { DialogNotconnectedComponent } from './dialog-notconnected/dialog-notconnected.component';
import { FgoogleService } from 'app/service/fgoogle.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  data: Object = "";
  is_loaded = false;
  today = new Date();
  from: any;
  to: any;
  days = [];
  lc_days = []
  confirmed = [];
  deaths = [];
  recovered = [];
  lc_confirmed = [];
  lc_recovered = [];
  lc_deaths = [];
  user: any

  // PIE CHART SETTINGS 
  pieChartLabels: Label[];
  pieChartData: SingleDataSet;
  pieChartOptions: ChartOptions;
  pieChartType: ChartType;
  pieChartLegend: boolean;
  pieChartPlugins: any;

  // BAR CHART SETTINGS 
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[] = [];

  // LINE CHART SETTINGS
  lineChartData: ChartDataSets[] = [];
  lineChartLabels: Label[] = [];
  lineChartOptions: (ChartOptions) = {
    responsive: true,
  };
  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];

  lineChartLegend = true;
  lineChartType = 'line';
  lineChartPlugins = [];
  source: LocalDataSource = new LocalDataSource([]);

  news: any; 
  has_news=false; 
  lowValue: number = 0;
  highValue: number = 1;
  pageIndex: number = 0;
  pageSize: number = 1;


  constructor(
    private http: HttpService,
    private route: Router,
    public dialog: MatDialog,
    private fgoogle: FgoogleService  ) {
  }

  settings = {
    actions: false,
    columns: {
      Country: {
        title: 'Country',
        filter: true
      },
      NewConfirmed: {
        title: 'New cases',
        filter: false
      },
      TotalConfirmed: {
        title: 'Total cases',
        filter: false,
        sortDirection: 'desc'
      },
      NewRecovered: {
        title: 'New recoveries',
        filter: false
      },
      TotalRecovered: {
        title: 'Total recoveries',
        filter: false
      },
      NewDeaths: {
        title: 'New deaths',
        filter: false
      },
      TotalDeaths: {
        title: 'Total deaths',
        filter: false
      }
    }
  };

  async ngOnInit() {

    //GET NEWS 
    this.news = await this.fgoogle.get_news("Worldwide")
    console.log(this.news)
    if (this.news != undefined) {
      this.has_news = true;
    } else {
      this.has_news = false;
    }
    
    this.user = JSON.parse(localStorage.getItem("user"))

    // PRE PROCESSING DATE STRUCTURE
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

    // BAR CHART 
    this.barChartLabels = this.days;
    await this.http.getFromCovidApi("world?from=" + this.from + "&to=" + this.to).then((x) => {
      x.forEach(element => {
        this.confirmed.push(element.NewConfirmed);
        this.recovered.push(element.NewRecovered);
        this.deaths.push(element.NewDeaths);
      });
    })
    this.barChartData.push(
      {
        data: this.confirmed, label: 'New confirmed',
      },
      {
        data: this.recovered, label: 'New recovered',
      },
      {
        data: this.deaths, label: 'New deaths',
      })

    // LINE CHART
    let april_day = new Date(2020, 3, 13)
    await this.http.getFromCovidApi("world?from=2020-04-13T00:00:00.000Z&to=" + this.to).then((x) => {
      x.forEach(element => {
        this.lc_confirmed.push(element.TotalConfirmed);
        this.lc_recovered.push(element.TotalRecovered);
        this.lc_deaths.push(element.TotalDeaths);
        let month = april_day.getMonth() + 1;
        this.lc_days.push(april_day.getDate() + '/' + month);
        april_day.setDate(april_day.getDate() + 1);
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

    // PIE CHART
    await this.http.getFromCovidApi("summary").then(x => {
      this.data = x['Global'];
    }).then(() => {
      this.pieChartOptions = {
        responsive: true,
      };
      this.pieChartLabels = [['Active'], ['Recovered'], ['Dead']];
      this.pieChartData = [(this.data['TotalConfirmed'] - this.data['TotalDeaths']) * 100 / this.data['TotalConfirmed'] - this.data['TotalRecovered'] * 100 / this.data['TotalConfirmed'], this.data['TotalRecovered'] * 100 / this.data['TotalConfirmed'], this.data['TotalDeaths'] * 100 / this.data['TotalConfirmed']];
      this.pieChartType = 'pie';
      this.pieChartLegend = true;
      this.pieChartPlugins = [];
    })

    await this.http.getFromCovidApi("summary").then(x => {
      this.source.load(x['Countries'])
    })
    this.is_loaded = true

  }

  onUserRowSelect(event) {
    this.route.navigate(['/country', { country: event.data.Country }])

  }

  toNews() {
    if (this.user != undefined) {
      if (this.user.can_add) {
        this.route.navigateByUrl('news')
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


import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AnswerStats } from '../models/AnswerStats';
import * as Chart from 'chart.js';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit,OnChanges {

  chart:Chart;
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      xAxes: [{
          ticks: {
              fontSize: 18
          }
      }],
      yAxes: [{
        ticks: {
            fontSize: 18
        }
    }]
  }
  };
  public barChartLabels;
  public barChartType = 'bar';
  public barChartLegend = true;
  datasets;
  @Input() data:Array<AnswerStats>;
  counts:Array<number>= new Array<number>();
  answerTexts:Array<string> = new Array<string>();
  chartready:boolean = false;
  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'data': {
            this.refreshChart();
            console.log("refreshed Dataset in cahrt comp");
          }
        }
      }
    }
  }

  refreshChart(){
    console.log(this.data);
    this.data.forEach( anstats => {
      this.answerTexts.push(anstats.answer.text);
      this.counts.push(anstats.count);
    })
    console.log("Chartból: ");
    console.log(this.counts);
    console.log(this.answerTexts);
    this.barChartLabels = this.answerTexts;
    this.datasets = [
      {
        data: this.counts,
        backgroundColor: ['#e21b3c',
        '#d89e00',
        '#1368ce',
        '#26890c'],
        label:'',
        fill: false,
      }
    ]
    this.chartready=true;
  }
    
}

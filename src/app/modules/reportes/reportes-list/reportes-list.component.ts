import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reportes-list',
  templateUrl: './reportes-list.component.html',
  styleUrls: ['./reportes-list.component.css']
})
export class ReportesListComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
    console.log('Componente de Reportes cargado');
  }
}
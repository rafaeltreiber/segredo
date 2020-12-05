import { Component } from '@angular/core';
import { Partida, DataService } from 'src/app/data.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public part: Partida = new Partida();

  constructor(private router: Router, private afs: AngularFirestore, private ds: DataService) {
    this.part.nome = "Bruna";
  }

  async Esconder() {
    /*  this.iniciado = true;
      this.isbuttonenabled = false;
      this.part.situacao = "Aguardando oponente";*/
      await this.Gravar();
    //  this.LerRegistrosProprios();
    //  this.startTimer();
    }

  async Gravar() {
    try {
      /*this.afs.collection(this.part.nome).add({
        imgX: this.part.imgX, imgY: this.part.imgY,
        situacao: this.part.situacao, matriz_propria: JSON.stringify(this.part.matriz_propria),
        matriz_oponente: JSON.stringify(this.part.matriz_oponente)
      });*/
      this.ds.addPartida(this.part);

    } catch (error) {
      alert("Erro ao salvar: " + error);
    }
  }

}

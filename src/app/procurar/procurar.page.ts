import { Component, OnInit } from '@angular/core';
import { Partida, DataService } from 'src/app/data.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-procurar',
  templateUrl: './procurar.page.html',
  styleUrls: ['./procurar.page.scss'],
})
export class ProcurarPage implements OnInit {
  part: Partida = new Partida();
  part_oponente = new Partida();
  GameOver: boolean = false;

  constructor(private ds: DataService, private route: ActivatedRoute, private router: Router,
    private afs: AngularFirestore) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.part = JSON.parse(this.router.getCurrentNavigation().extras.state.conteudos);
      }
    });
  }

  ngOnInit() {
    this.GetPartidaOponente(this.part.id_oponente);
    this.GetPartidaPropria(this.part.id);
  }

  ionViewWillLeave() {
    this.part.situacao = "Encerrado";
    this.part_oponente.situacao = "Encerrado";
    this.ds.updatePartida(this.part);
    this.ds.updatePartida(this.part_oponente);
  }  

  GetPartidaPropria(id) {
    this.afs.doc('partidas/' + id).valueChanges().subscribe(res => {
      this.part.imgX = res["imgX"];
      this.part.imgY = res["imgY"];
      this.part.id_oponente = res["id_oponente"];
      this.part.id = res["id"];
      this.part.email = res["email"];
      this.part.turno = res["turno"];
      this.part.situacao = res["situacao"];
      this.part.matriz_propria = JSON.parse(res["matriz_propria"]);
      this.part.matriz_oponente = JSON.parse(res["matriz_oponente"]);
    })
  }

  GetPartidaOponente(id) {
    this.afs.doc('partidas/' + id).valueChanges().subscribe(res => {
      this.part_oponente.imgX = res["imgX"];
      this.part_oponente.imgY = res["imgY"];
      this.part_oponente.id_oponente = res["id_oponente"];
      this.part_oponente.id = res["id"];
      this.part_oponente.email = res["email"];
      this.part_oponente.turno = res["turno"];
      this.part_oponente.situacao = res["situacao"];
      this.part_oponente.matriz_propria = JSON.parse(res["matriz_propria"]);
      this.part_oponente.matriz_oponente = JSON.parse(res["matriz_oponente"]);
     
      if (this.part_oponente.matriz_oponente[this.part.imgX][this.part.imgY] ==
        this.part.matriz_propria[this.part.imgX][this.part.imgY] && this.GameOver != true) {
        this.GameOver = true;
        alert("O oponente achou");
      }
    })
  }

  NovoJogo() {
    let navigationExtras: NavigationExtras = {
      state: {
        conteudos: JSON.stringify(this.part)
      }
    };
    this.router.navigate(['esconder'], navigationExtras);    
  }


  GetImage(x: number, y: number, Jogador: string) {
    switch (Jogador == "proprio" ? this.part.matriz_oponente[x][y] : this.part_oponente.matriz_oponente[x][y]) {
      case (0):
        return "assets/imgs/question.png";
      case (1):
        return "assets/imgs/1.png";
      case (2):
        return "assets/imgs/2.png";
      case (3):
        return "assets/imgs/3.png";
      case (4):
        return "assets/imgs/4.png";
      case (5):
        return "assets/imgs/5.png";
      case (6):
        return "assets/imgs/6.png";
      case (7):
        return "assets/imgs/7.png";
      case (8):
        return "assets/imgs/8.png";
      case (9):
        return "assets/imgs/9.png";
      case (10):
        return "assets/imgs/10.png";
      case (11):
        return "assets/imgs/11.png";
      case (12):
        return "assets/imgs/12.png";
      case (13):
        return "assets/imgs/13.png";
      case (14):
        return "assets/imgs/14.png";
      case (999):
        return "assets/imgs/unknown.png";
    }
  }

  async Procurar(posX: number, posY: number) {
    if (this.part.turno == false || this.GameOver == true)
      return;

    this.part.matriz_oponente[posX][posY] = this.part_oponente.matriz_propria[posX][posY];
    if (this.part_oponente.matriz_propria[posX][posY] == 0) {
      //achou
      this.part_oponente.situacao = "Finalizado";
      this.part.situacao = "Finalizado";

      this.ds.updatePartida(this.part).then()
      {
        this.ds.updatePartida(this.part_oponente).then()
        {
          alert("Parabéns! Você venceu!");
          this.GameOver = true;
        }
      }
    }
    else {
      // Nosso turno acabou
      this.part.turno = false;
      this.part_oponente.turno = true;
      this.ds.updatePartida(this.part).then()
      {
        this.ds.updatePartida(this.part_oponente);
      }
    }
  }

}

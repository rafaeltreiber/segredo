import { Component, OnInit } from '@angular/core';
import { Partida, DataService } from 'src/app/data.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-esconder',
  templateUrl: './esconder.page.html',
  styleUrls: ['./esconder.page.scss'],
})
export class EsconderPage implements OnInit {
  public part: Partida = new Partida();
  private Partidas: Partida[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private ds: DataService) {

  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.part = new Partida();
  }

  ionViewWillLeave() {
    this.part.situacao = "Encerrado";
    this.ds.updatePartida(this.part);
  }

  Deslogar() {
    this.ds.signOut();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  GetImage(x: number, y: number) {
    if (this.part.imgX == x && this.part.imgY == y)
      return "assets/imgs/question.png";
    else
      return "assets/imgs/dick.jpg";
  }

  GeraMatrizPropria() {
    let x = 0;
    let y = 0;

    for (x = 0; x < 6; x++) {
      for (y = 0; y < 10; y++) {
        this.part.matriz_propria[x][y] = Math.abs(this.part.imgX - x) + Math.abs(this.part.imgY - y);
      }
    }
  }

  PegaTodos() {
    this.ds.getAll().subscribe(res => {
      this.Partidas = res;
      this.VerificaDoisProntos();
    });
  }

  VerificaDoisProntos() {
    var a;
    for (a = 0; a < this.Partidas.length; a++) {
      if (this.Partidas[a].situacao == "Procurando" && this.Partidas[a].email == this.part.email) {
        this.part.id = this.Partidas[a].id;
        this.part.matriz_propria = JSON.parse(JSON.stringify(this.part.matriz_propria));
        this.part.matriz_oponente = JSON.parse(JSON.stringify(this.part.matriz_oponente));
        this.ds.updatePartida(Object.assign({}, this.part)).then()
        {
          for (a = 0; a < this.Partidas.length; a++) {
            if (this.Partidas[a].situacao == "Procurando" && this.Partidas[a].email != this.part.email) {
              this.part.id_oponente = this.Partidas[a].id;
              this.ds.updatePartida(Object.assign({}, this.part)).then()
              {
                this.ProximaPagina();
              }
            }
          }
        }
      }
    }
  }

  async ProximaPagina() {
    let navigationExtras: NavigationExtras = {
      state: {
        conteudos: JSON.stringify(this.part)
      }
    };
    this.router.navigate(['procurar'], navigationExtras);
  }

  Salvar() {
    this.GeraMatrizPropria();
    this.ds.getUserEmail().then((res) => {
      this.part.email = res;
      if (this.part.email == "bruna@delicia.com")
        this.part.turno = false;
      else
        this.part.turno = true;
      this.part.situacao = "Procurando";
      try {
        this.ds.addPartida(Object.assign({}, this.part));
        this.PegaTodos();
      } catch (error) {
        alert("Erro ao salvar: " + error);
      }
    })
  }

  Esconder(posX: number, posY: number) {
    this.part.imgX = posX;
    this.part.imgY = posY;
    this.GeraMatrizPropria();
  }
}

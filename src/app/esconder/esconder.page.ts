import { Component, OnInit } from '@angular/core';
import { Partida, DataService } from 'src/app/data.service';
import { Observable } from 'rxjs';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-esconder',
  templateUrl: './esconder.page.html',
  styleUrls: ['./esconder.page.scss'],
})
export class EsconderPage implements OnInit {
  public part: Partida = new Partida();
  private Partidas: Partida[] = [];

  constructor(private router: Router, private ds: DataService) { }

  ngOnInit() {
  }

  Deslogar()
  {
    this.ds.signOut();
    this.router.navigateByUrl('/login', { replaceUrl: true });
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
      if (this.Partidas[a].situacao == "Escondendo" && this.Partidas[a].nome != this.part.nome)
        this.ProximaPagina();
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

  Esconder() {
    try {      
      this.part.turno = true;
      this.part.situacao = "Escondendo";
      this.ds.addPartida(Object.assign({}, this.part));
      this.PegaTodos();
    } catch (error) {
      alert("Erro ao salvar: " + error);
    }

  }


}

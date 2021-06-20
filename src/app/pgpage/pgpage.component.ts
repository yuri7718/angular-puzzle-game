import { Component, Input, OnInit } from '@angular/core';
import { ImageService } from '../services/image.service';
import { TimeBlockLimitationService } from '../services/time-block-limitation.service';
import { wrapGrid } from 'animate-css-grid';
import { ActivatedRoute, Router } from '@angular/router';
import { interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import * as $ from 'jquery';
import * as bootstrap from "bootstrap";
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pgpage',
  templateUrl: './pgpage.component.html',
  styleUrls: ['./pgpage.component.scss']
})
export class PgpageComponent implements OnInit {

  @Input()
  timeLeft: number;
  timeBlockLimitation: number;
  displayedTime: string;

  grid: any;
  puzzleKeys: any;
  tiles: any;

  obs = interval(1000);
  timerOn: boolean = false;

  form: FormGroup;
  prize: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private imageService: ImageService,
    private timeBlockLimitationService: TimeBlockLimitationService
    ) {
    
    /*
      A B C
      D E F
      G H I
    */
    this.puzzleKeys = {
      A: ["B", "D"],
      B: ["A", "C", "E"],
      C: ["B", "F"],
      D: ["A", "E", "G"],
      E: ["B", "D", "F", "H"],
      F: ["C", "E", "I"],
      G: ["D", "H"],
      H: ["E", "G", "I"],
      I: ["F", "H"]
    }
    this.timeLeft = this.activatedRoute.snapshot.params.timeLeft;
    this.displayedTime = this.displayTime(this.timeLeft);
    this.timeBlockLimitation = this.timeBlockLimitationService.getLimitation();
    
    if (this.timeLeft != 30 && this.timeLeft != 60 && this.timeLeft != 120 && this.timeLeft != 300) {
      this.router.navigate(['/app']);
    }

    this.form = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'phone': new FormControl(
        null, [Validators.required, Validators.pattern('^\\d{10}$|^\\(\\d{3}\\) ?\\d{3}-\\d{4}$')]
      )
    });

    this.prize = {
      30: "50$",
      60: "10$",
      120: "5$",
      300: "1$"
    }
    
  }

  ngOnInit(): void {

    this.grid = document.querySelector(".grid") as HTMLElement;

    let canvas = document.createElement('canvas') as HTMLCanvasElement;
    canvas.width = 480;
    canvas.height = 480;
    let context = canvas.getContext('2d')!;

    let img = new Image();
    img.src = this.imageService.getPuzzleImgURL();

    img.onload = () => {
      
      context.drawImage(img,0,0,480,480);
      let imgData = canvas.toDataURL();
        
      (document.getElementById("puzzle-img") as HTMLImageElement).src = imgData;

      this.tiles = document.querySelectorAll('.tile');

      for (let i=0; i<this.tiles.length; i++) {
        let tile = this.tiles[i] as HTMLElement;
        if (tile.classList.contains('tile--empty')) {
          tile.style.backgroundImage = "linear-gradient( rgba(0,0,0,.9), rgba(0,0,0,.9) ), url(" + imgData + ")";
        } else {
          tile.style.backgroundImage = "url(" + imgData + ")";
        }
      }

      this.shuffle();
      this.addListeners();    
    }
  }

  private displayTime(time: number) {
    let min = Math.floor(time/60);
    let sec = time % 60;
    return sec < 10 ? min.toString() + ":0" + sec.toString() : min.toString() + ":" + sec.toString();
  }

  private addListeners() {
    Array.from(this.tiles).map(tile => {
      (tile as HTMLInputElement).addEventListener("click", this.tileMovement);
    });
  }

  tileMovement = (event: MouseEvent) => {
    const { forceGridAnimation } = wrapGrid(this.grid);

    if (this.timerOn == false) {
      this.timerOn = true;
      this.obs.pipe(takeWhile(() => this.timerOn)).subscribe(() => { 
        this.timeLeft--;
        this.displayedTime = this.displayTime(this.timeLeft);
        if (this.timeLeft === 0) {
          jQuery('#fail').modal('show');
          this.timerOn = false;
          this.timeLeft = this.activatedRoute.snapshot.params.timeLeft;
          Array.from(this.tiles).map(tile => (tile as HTMLInputElement).disabled = true);
            
          let count = this.timeBlockLimitation * 60;

          function decTimeBlock() {
            setTimeout(() => {
              if (count !== 0) {
                count--;
                let min = Math.floor(count/60);
                let sec = count % 60;
                let retryTime = sec < 10 ? min.toString() + ":0" + sec.toString() : min.toString() + ":" + sec.toString();
                (document.getElementById("count") as HTMLElement).textContent = retryTime;
                decTimeBlock();
              } else {
                (document.getElementById("retry") as HTMLInputElement).disabled = false;
                (document.getElementById("count") as HTMLElement).textContent = "";
              }
            }, 1000);
          }
          decTimeBlock();   
        }
      });
    }

    let target = event.target as HTMLInputElement;
    const tileArea = target.style.getPropertyValue("--area");

    let emptyTile = document.querySelector(".tile--empty") as HTMLInputElement;
    const emptyTileArea = emptyTile.style.getPropertyValue("--area");

    emptyTile.style.setProperty("--area", tileArea);
    target.style.setProperty("--area", emptyTileArea);

    forceGridAnimation();
    this.unlockTiles(tileArea);
    this.checkIsSolved();
  }

  private unlockTiles(currentTileArea: string) {
    Array.from(this.tiles).map(t => {
      let tile = t as HTMLInputElement;
      const tileArea = tile.style.getPropertyValue("--area");
      tile.disabled = this.puzzleKeys[currentTileArea].includes(tileArea) ? false : true;
    });
  }

  // check if the 3x3 puzzle is solvable
  private solvable(puzzleTiles: string[]) {
    let invCount = 0;
    let order = Object.keys(this.puzzleKeys).map(x => puzzleTiles.indexOf(x)+1);

    for (let i=0; i<order.length; i++) {
      if (order[i] == 9) continue;
      for (let j=i+1; j<order.length; j++) {
        if (order[i] > order[j]) invCount++;
      }
    }
    return invCount % 2 === 0;
  }
   
  private shuffle() { 
    let puzzleTiles = Object.keys(this.puzzleKeys);
    
    puzzleTiles.sort(() => .5-Math.random());
    while (!this.solvable(puzzleTiles)) {
      puzzleTiles.sort(() => .5-Math.random());
    }

    Array.from(this.tiles).map((tile, i) => (tile as HTMLInputElement).style.setProperty("--area", puzzleTiles[i]));
  
    let emptyTile = document.querySelector(".tile--empty") as HTMLInputElement;
    this.unlockTiles(emptyTile.style.getPropertyValue("--area"));
  }

  private checkIsSolved() {
    let currentTiles = Array.from(this.tiles).map(tile => (tile as HTMLInputElement).style.getPropertyValue("--area"));
    if (JSON.stringify(currentTiles) === JSON.stringify(Object.keys(this.puzzleKeys))) {
      this.timerOn = false;
      let winningPrize = this.prize[this.activatedRoute.snapshot.params.timeLeft];
      (document.getElementById("prize") as HTMLElement).textContent = winningPrize;
      jQuery('#win').modal('show');
    }
  }

  retry() {
    this.timerOn = false;
    this.timeLeft = this.activatedRoute.snapshot.params.timeLeft;
    this.shuffle();
    this.addListeners();
    (document.getElementById("retry") as HTMLInputElement).disabled = true;
  }

  submitForm() {
    console.log(this.form.value);
    this.form.reset();
    jQuery('#win').modal('hide');
  }

  get name() {
    return this.form.get('name');
  }
  get email() {
    return this.form.get('email');
  }
  get phone() {
    return this.form.get('phone');
  }
}

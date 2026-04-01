import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CONFIG } from '../../../../config';

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.css'
})
export class GameListComponent implements OnInit {
  operatorId: any;
  operatorName:any
  showAddModal: boolean = false
  gameList: any[] = [];
  numbers: number[] = Array.from({ length: 100 }, (_, i) => i + 1);
  showModal: boolean = false;
  eventList: any
  showRtpModal: boolean = false;
  selectedGame: any;
  rtpOverride: number | null = null;
  addForm!: FormGroup;
  gameForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router
  ) {
    const userId = this.route.snapshot.paramMap.get('id');
    const operatorName = this.route.snapshot.paramMap.get('name');
    this.operatorId = userId;
    this.operatorName = operatorName
  }

  ngOnInit(): void {
    this.getGameList();
    this.initForm();
    this.getEventList()
  }

  initForm() {
    this.gameForm = this.fb.group({
      eventId: ['', Validators.required],
      eventName: ['', Validators.required],
      sequence: [0, Validators.required],
      link: ['', Validators.required],
      icon: [''],
      image: [''],
      minBet: [0],
      maxBet: [0],
      enabled: [true],
      maintenance: [false]
    });
    this.addForm = this.fb.group({
      eventId: ['', Validators.required],
      enabled: [true]
    });
  }

  getGameList() {
    this.http.post(`${CONFIG.getOperatorGames}${this.operatorId}`, {}).subscribe((data: any) => {
      console.log('data', data?.data);
      this.gameList = data?.data || [];
    });
  }

  updateSequence(value: any, game: any) {
    const payload = {
      operatorId: this.operatorId,
      eventId: game.eventId,
      sequence: parseInt(value)
    };
    this.http.post(`${CONFIG}`, payload).subscribe({
      next: (res) => {
        console.log('Sequence updated', res);
      },
      error: (err) => {
        console.error('Error updating sequence', err);
      }
    });
  }


  updateMaintenance(value: any, game: any) {
    const payload = {
      operatorId: this.operatorId,
      eventId: game.eventId,
      maintenance: value === 'true'
    };
    this.http.post(`${CONFIG}`, payload).subscribe({
      next: (res) => {
        console.log('Maintenance status updated', res);
      },
      error: (err) => {
        console.error('Error updating maintenance', err);
      }
    });
  }

  getEventList() {
    this.http.get(CONFIG.getAllEvent).subscribe({
      next: (res: any) => {
        if (res?.data) {
          // ✅ Sort by sequence ascending
          this.eventList = res.data.sort((a: any, b: any) => a.sequence - b.sequence);
        }
      },
      error: (err) => {
        console.error('Failed to fetch events:', err);
      }
    });
  }



  closeRtpModal() {
    this.showRtpModal = false;
    this.selectedGame = null;
    this.rtpOverride = null;
  }



  openModal(game?: any) {
    if (game) {
      this.selectedGame = game;
      this.gameForm.patchValue({
        eventId: game.eventId,
        eventName: game.eventName,
        sequence: game.sequence,
        link: game.link,
        icon: game.icon,
        image: game.image,
        minBet: game.operator.minBet,
        maxBet: game.operator.maxBet,
        enabled: game.operator.enabled,
        maintenance: game.operator.maintenance
      });
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedGame = null;
    this.gameForm.reset();
  }

  onSubmit() {
    if (this.gameForm.invalid) return;

    const formValue = this.gameForm.value;
    const payload = {
      operatorId: this.operatorId,
      eventId: formValue.eventId,
      eventName: formValue.eventName,
      sequence: formValue.sequence,
      link: formValue.link,
      icon: formValue.icon,
      image: formValue.image,
      minBet: formValue.minBet,
      maxBet: formValue.maxBet,
      enabled: formValue.enabled,
      maintenance: formValue.maintenance
    };

    this.http.post(`${CONFIG}`, payload).subscribe({
      next: (res) => {
        console.log('Game updated', res);
        this.getGameList();
        this.closeModal();
      },
      error: (err) => {
        console.error('Error updating game', err);
      }
    });
  }

  openAddModal() {
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
    this.addForm.reset({ enabled: true });
  }

  onAddSubmit() {
    if (this.addForm.invalid) return;

    const { eventId, enabled } = this.addForm.value;

    // const url = `{{local}}/api/operator/games/${eventId}/${this.operatorId}/enabled`;
    const url = `${CONFIG.addGame}/${eventId}/${this.operatorId}/enabled`
    const payload = {
      enabled: enabled === true || enabled === 'true'
    };

    this.http.post(url, payload).subscribe({
      next: (res) => {
        console.log('Event added for operator', res);
        this.getGameList();
        this.closeAddModal();
      },
      error: (err) => {
        console.error('Error adding event', err);
      }
    });
  }
  updateEnabled(value: boolean, game: any) {
    const url = `${CONFIG.addGame}/${game._id}/${this.operatorId}/enabled`;

    const payload = {
      enabled: value
    };

    console.log('payload', payload);

    this.http.post(url, payload).subscribe({
      next: (res) => {
        console.log('Enabled updated', res);
        this.getGameList();
      },
      error: (err) => {
        console.error('Error updating enabled', err);
      }
    });
  }

  updateRtp(game: any, rtpOverride: any) {
    if (!game || !game.eventId) {
      console.error('Game missing');
      return;
    }

    const url = `${CONFIG.updateGameRtp}/${game._id}/${this.operatorId}/rtp`;

    const payload = {
      rtpOverride: Number(rtpOverride)
    };

    console.log('RTP payload =>', payload);

    this.http.post(url, payload).subscribe({
      next: (res) => {
        console.log('RTP updated', res);
        this.getGameList();
      },
      error: (err) => {
        console.error('Error updating RTP', err);
      }
    });
  }

  openRtpModal(game: any) {
    this.selectedGame = game;
    this.rtpOverride = game.operator.rtpOverride;
    this.showRtpModal = true;
  }

  updateLimits(game: any) {
    if (!game || !game._id) return;

    const url = `${CONFIG.updateGameLimits}/${game._id}/${this.operatorId}/limits`;

    const payload = {
      minBet: Number(game.operator.minBet),
      maxBet: Number(game.operator.maxBet)
    };

    console.log('LIMIT payload =>', payload);

    this.http.post(url, payload).subscribe({
      next: (res) => {
        console.log('Limits updated', res);
        this.getGameList();
      },
      error: (err) => {
        console.error('Error updating limits', err);
      }
    });
  }
}
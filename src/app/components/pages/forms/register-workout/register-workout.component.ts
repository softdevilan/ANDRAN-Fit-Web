import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { Database, ref, get, set, push } from '@angular/fire/database';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';

@Component({
  selector: 'app-register-workout',
  imports: [ CommonModule, ReactiveFormsModule],
  templateUrl: './register-workout.component.html',
  styleUrl: './register-workout.component.css'
})
export class RegisterWorkoutComponent {
  trainerUid: string | null = null;
  clientUid: string | null = null;
  private db = inject(Database);
  private routeSub!: Subscription;

  workoutsArray: any[] = [];
  exercisesArray: any[] = [];
  client: any;

  formVisible: boolean = false;

  ngForm = new FormGroup({
    fechaPropuesta: new FormControl('', [Validators.required]),
    duracionPropuesta: new FormControl('', [Validators.required]),
  });

  ngExercForm = new FormGroup({
    nombreEjercicio: new FormControl('', [Validators.required]),
    reps: new FormControl('', [Validators.required]),
    series: new FormControl('', [Validators.required]),
    peso: new FormControl(''),
    progresivo: new FormControl(''),
    variacion: new FormControl(''),
    indicaciones: new FormControl('')
  });

  constructor(private router: Router) {}
  
  async obtenerEjercicios() {
    const workoutRef = ref(this.db, `Deporte/Workouts`);
    try {
      const snapshot = await get(workoutRef);
      if (snapshot.exists()) {
        this.workoutsArray = Object.values(snapshot.val());
        console.log("✅ Workouts obtenidos:", this.workoutsArray);
      } else {
        console.log("⚠️ Workouts no encontrados.");
      }
    } catch (error) {
      console.error("❌ Error obteniendo workouts:", error);
    }
  }

  async obtenerCliente() {
    if (!this.clientUid) return;
    const clientRef = ref(this.db, `Usuarios/Clientes/${this.clientUid}`);
    try {
      const snapshot = await get(clientRef);
      if (snapshot.exists()) {
        this.client = snapshot.val();
        console.log("✅ Cliente obtenido:", this.client);
      } else {
        console.log("⚠️ Cliente no encontrado.");
      }
    } catch (error) {
      console.error("❌ Error obteniendo cliente:", error);
    }
  }

  ngOnInit(): void {
    console.log("📝 RegisterWorkout inicializado");
    const matches = this.router.url.match(/\/register-workout\/([^/]+)\/([^/]+)/);
    if (matches) {
      this.trainerUid = matches[1];
      this.clientUid = matches[2];
    }
    this.obtenerCliente();
    this.obtenerEjercicios();
  }

  async onSubmit(): Promise<void> {
    if (this.ngForm.invalid) return;
    try {
      const formData = this.ngForm.value;
      const workout = this.crearWorkout(formData);
      await this.registrarWorkout(workout);
      this.ngForm.reset();
      this.exercisesArray = [];
    } catch (error) {
      console.error('❌ Error:', error);
    }
  }

  registrarEjercicio() {
    if (this.ngExercForm.invalid) return;
    const formData = this.ngExercForm.value;
    const ejercicio = this.crearEjercicio(formData);
    this.exercisesArray.push(ejercicio);
    console.log('✅ Ejercicio añadido:', ejercicio);
    this.ngExercForm.reset();
  }

  crearEjercicio(formData: any): any {
    return {
      "Nombre": formData.nombreEjercicio || '',
      "Peso": formData.peso || 0,
      "Progresivo": {
        "Tipo": formData.progresivo || '',
        "Variación": formData.variacion || ''
      },
      "Reps": formData.reps || 0,
      "Series": formData.series || 0
    };
  }

  crearWorkout(formData: any): any {
    const fecha = formData.fechaPropuesta;
    const timestampFecha = fecha ? Math.floor(new Date(fecha).getTime() / 1000) : Date.now();
    return {
      "Ejercicios": [...this.exercisesArray],
      "Entrenador": this.trainerUid,
      "Fecha": timestampFecha,
      "Tiempo": formData.duracionPropuesta || 0
    };
  }

  async registrarWorkout(workout: any) {
    if (!this.clientUid) return;
    const clientWorkoutRef = ref(this.db, `Usuarios/Clientes/${this.clientUid}/Workouts/Pendientes`);
    try {
      const newWorkoutRef = push(clientWorkoutRef);
      const workoutToSave = {
        ...workout,
        id: newWorkoutRef.key
      };
      
      await set(newWorkoutRef, workoutToSave);
      console.log("✅ Workout agregado correctamente.");
      
      // Limpiar el array de ejercicios después de guardar
      this.exercisesArray = [];
    } catch (error) {
      console.error("❌ Error al agregar Workout:", error);
    }
  }
}

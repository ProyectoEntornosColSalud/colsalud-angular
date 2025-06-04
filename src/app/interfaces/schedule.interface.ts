export interface Specialty {
  id: number;
  name: string;
  description: string | null;
}

export interface Doctor {
  id: number;
  name: string;
  age: number;
  gender: string;
}

export interface UserAppointment {
  appointmentId: number;
  doctorName: string;
  specialtyName: string;
  time: string;
  status: string;
}

export interface DoctorAppointment {
  specialtyName: string;
  appointmentId: number;
  startTime: string;
  patientName: string;
  status: string;
}

export interface AppointmentDetail {
  appointment: {
    id: number;
    specialtyName: string;
    date: string;
  };
  patient: {
    name: string;
    dob: string;
    gender: string;
  }
}



export const GENDERS: { value:string; viewValue:string }[] = [
  { value: 'hombre', viewValue: 'Hombre' },
  { value: 'mujer', viewValue: 'Mujer' },
  { value: 'no-binario', viewValue: 'No binario' },
  { value: 'genero-fluido', viewValue: 'Género fluido' },
  { value: 'bigenero', viewValue: 'Bigénero' },
  { value: 'trigenero', viewValue: 'Trigénero' },
  { value: 'agenero', viewValue: 'Agénero' },
  { value: 'demiboy', viewValue: 'Demiboy' },
  { value: 'demigirl', viewValue: 'Demigirl' },
  { value: 'neutrois', viewValue: 'Neutrois' },
  { value: 'maverique', viewValue: 'Maverique' },
  { value: 'androgino', viewValue: 'Andrógino' },
  { value: 'genero-queer', viewValue: 'Género queer' },
  { value: 'dos-espiritus', viewValue: 'Dos espíritus' },
  { value: 'hijra', viewValue: 'Hijra' },
  { value: 'faafafine', viewValue: 'Fa’afafine' },
  { value: 'bakla', viewValue: 'Bakla' },
  { value: 'muxhe', viewValue: 'Muxhe' },
  { value: 'intergenero', viewValue: 'Intergénero' },
  { value: 'autogenero', viewValue: 'Autogénero' },
  { value: 'aliagenero', viewValue: 'Aliagénero' },
  { value: 'xenogenero', viewValue: 'Xenogénero' },
];

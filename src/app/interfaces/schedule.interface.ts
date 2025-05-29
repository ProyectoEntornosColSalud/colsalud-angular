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

import moment from "moment/moment";

export interface Employee {
	id: number;
	firstName: string;
	lastName: string;
	birthdate: moment.Moment | string;
	mobilePhone: string;
	workPhone: string;
	email: string;
	job: Job;
}

export interface Job {
	id: number;
	company: string;
	jobTitle: string;
	address: string;
}

export interface EmployeeFormValues {
	firstName: string;
	lastName: string;
	birthdate: moment.Moment;
	mobilePhone: string;
	workPhone: string;
	email: string;
}

export type CoworkersType = 'company' | 'job' | 'address';

export type ExportType = 'phonebook' | 'employee-job';
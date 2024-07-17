import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage';

export class AdminGetAllCoursesMessage extends AdminMessage {
    element: string;

    constructor(element: string) {
        super();
        this.element = element;
    }
}
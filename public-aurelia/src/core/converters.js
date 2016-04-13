import moment from 'moment';


export class ObjectValuesValueConverter {
    toView(o) {

        if(o == null) return [];

        return Object.keys(o).map(key => {
            return {
                key:key,
                value:o[key]
            }
        });
    }
}

export class DateFormatValueConverter {
    toView(value) {
        return moment(value).format('dddd[,] DD [de] MMMM [de] YYYY');
    }
}

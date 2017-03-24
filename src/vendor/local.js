export default {
    set: function( key, value){
        localStorage.setItem(key, JSON.stringify( value ) );
    },
    get: function( key ){
        var _strinify = localStorage.getItem( key );
        if(_strinify)
        {
            return JSON.parse( _strinify );   
        }
        return null;
    },
    remove: function( key ){
        localStorage.removeItem( key )
    }
}
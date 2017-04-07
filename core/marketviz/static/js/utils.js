/**
 * Created by eric on 4/6/17.
 */
function capitalizePhrase(phrase) {
    phrase = phrase.replace('_', ' ').toLowerCase();
    var new_header = [];
    phrase.split(' ').map((substring) =>
        new_header.push(substring.charAt(0).toUpperCase() + substring.slice(1))
    );
    return new_header.join(' ')
}

export { capitalizePhrase };
export const Radio = ({ id, name, value, state, handler, text }) => {
    return (
        <div>
            <input type="radio" id={id} name={name} value={value} checked={state === value} onChange={handler}/>
            <label htmlFor={id}>{text}</label><br/>
        </div>
    );
}
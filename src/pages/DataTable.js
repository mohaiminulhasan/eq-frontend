import { useEffect, useState } from "react"
import { domain } from '../utils'
import Fuse from 'fuse.js'

export const DataTable = () => {
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [tempArr, setTempArr] = useState([]);
    
    const fuse = new Fuse(data, {
        keys: ['name']
    })

    useEffect(() => {
        async function fetchData() {
            const uri = `${domain}/poi`;
            console.log(uri);

            let h = new Headers();
            h.append('Content-Type', 'application/json');

            let req = new Request(uri, {
                method: 'GET',
                headers: h,
                mode: 'cors'
            });

            const response = await fetch(req);
            const json = await response.json();

            
            setData(json);

        }
        
        fetchData();
    }, [])

    const style = {
        display: 'flex',
        flexDirection: 'column',
        width: '40vw',
        height: '80vh',
        justifyContent: 'center'
    }

    const headerStyle = {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'darkslateblue',
        borderRadius: 5,
        color: 'white',
        fontWeight: 'bold',
        justifyContent: 'space-around',
        padding: 5
    }

    const rowStyle = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 5
    }

    const searchDivStyle = {
        display: 'flex',
        flexDirection: 'row-reverse'
    }

    const handleChange = e => {
        const result = fuse.search(e.target.value);
        let tempArr = [];
        if (result.length !== 0) {
            result.forEach(el => {
                tempArr.push(el.refIndex)
            });
        } 

        setTempArr(tempArr);
        setSearch(e.target.value);
    }

    let rows = [];
    data.forEach(element => {
        rows.push(
            <div key={element.poi_id} style={{...rowStyle}}>
                <div>{element.poi_id}</div>
                <div style={{ backgroundColor: tempArr.includes(element.poi_id - 1) ? 'yellow' : 'transparent', flexBasis: '40%'}}>{element.name}</div>
                <div>{element.lat}</div>
                <div>{element.lon}</div>
            </div>
        )
    });

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{...style}}>
                <div style={{...searchDivStyle}}>
                    <input style={{ margin: 4, padding: 4}} type='text' value={search} onChange={handleChange} placeholder='Search...' autoFocus/>
                </div>
                <div style={{...headerStyle}}>
                    <div>id</div>
                    <div style={{ flexBasis: '40%'}}>name</div>
                    <div>latitude</div>
                    <div>longitude</div>
                </div>
                {rows}
            </div>
        </div>
    );
}
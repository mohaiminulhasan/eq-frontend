import { useEffect, useState } from "react";
import { Radio } from '../components';
import { domain } from '../utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart, Area, Line } from 'recharts';

function changeDate(x) {
    let dateObj = new Date(x.date);
    x.date = `${dateObj.toLocaleString('default', { month: 'short' })} ${dateObj.getDate()}`;
    return x;
}

function modifyValues(x) {
    x.impressions = Math.floor(x.impressions / 1000);
    x.revenue = Math.floor(x.revenue);
    return x;
}

function modifyLegend(value, entry) {
    if (value === 'impressions') {
        return <span>{value} (in thousands)</span>
    }
    return <span>{value}</span>
}

const EventsHourlyTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{backgroundColor: 'white', border: '2px slateblue solid', padding: '0 20px'}}>
        <p className="label">Time: {label < 10 && `0`}{`${label}:00`}</p>
        <p>Events: {payload[0].value}</p>
        <p>Date: {payload[0]['payload']['date']}</p>
      </div>
    );
  }

  return null;
};

const StatsHourlyTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{backgroundColor: 'white', border: '2px slateblue solid', padding: '0 20px'}}>
        <p className="label">Time: {label < 10 && `0`}{`${label}:00`}</p>
        <p>Date: {payload[0]['payload']['date']}</p>
        <p>Clicks: {payload[0]['payload']['clicks']}</p>
        <p>Impressions: {payload[0]['payload']['impressions']}</p>
        <p>Revenue: {payload[0]['payload']['revenue']}</p>
      </div>
    );
  }

  return null;
};

export const Graph = () => {
    const [category, setCategory] = useState('events');
    const [span, setSpan] = useState('daily');
    const [data, setData] = useState(null);


    useEffect(() => {
        async function fetchData() {
            const uri = `${domain}/${category}/${span}`;
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

            let result = json.map(changeDate);

            if (category === 'stats') {
                result = result.map(modifyValues);
            }
            
            setData(result);

        }
        
        fetchData();
    }, [category, span])

    const handleCategoryChange = e => {
        setCategory(e.target.value);
    }

    const handleSpanChange = e => {
        setSpan(e.target.value);
    }

    const renderChart = category === 'events' ? (
        <BarChart width={730} height={250} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            {span === 'hourly' && <XAxis dataKey="hour" xAxisId={0} />}
            {span === 'hourly' && <XAxis dataKey="date" xAxisId={1} />}
            {span === 'daily' && <XAxis dataKey="date" />}
            <YAxis />
            {span === 'daily' ? 
                <Tooltip /> :
                <Tooltip content={<EventsHourlyTooltip/>} />
            }
            <Legend />
            <Bar dataKey="events" fill="#8884d8"/>
        </BarChart>
    ) :
    (
        <ComposedChart width={730} height={250} data={data}>
            {console.log(data)}
            <XAxis dataKey="date" />
            <YAxis />
            {span === 'daily' ? 
                <Tooltip /> :
                <Tooltip content={<StatsHourlyTooltip/>} />
            }
            <Legend formatter={modifyLegend}/>
            <CartesianGrid stroke="#f5f5f5" />
            <Bar dataKey="clicks" barSize={20} fill="#413ea0" />
            <Area type="monotone" dataKey="revenue" fill="#8884d8" stroke="#8884d8" />
            <Line type="monotone" dataKey="impressions" stroke="#ff7300" />
        </ComposedChart>
    );

    const controlStyle = {
        display: 'flex', flexDirection: 'column', border: '2px darkslateblue solid', borderRadius: 10, padding: '15px 30px'
    }

    return (
        <>
        <div style={{ display: 'flex', justifyContent: 'space-around', margin: '20px 0' }}>
            <div style={{...controlStyle}}>
                <Radio id='events' name='category' value='events' state={category} handler={handleCategoryChange} text='Events' />
                <Radio id='stats' name='category' value='stats' state={category} handler={handleCategoryChange} text='Stats' />
            </div>

            <div style={{...controlStyle}}>
                <Radio id='daily' name='span' value='daily' state={span} handler={handleSpanChange} text='Daily' />
                <Radio id='hourly' name='span' value='hourly' state={span} handler={handleSpanChange} text='Hourly' />
            </div>
        </div>

        <ResponsiveContainer width='100%' height={700}>
            {renderChart}
        </ResponsiveContainer>
        </>
    );
}
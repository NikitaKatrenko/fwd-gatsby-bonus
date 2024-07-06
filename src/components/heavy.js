import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import _ from 'lodash'
import moment from 'moment'

// Importing a large image file
import LargeImage from '../images/very-large.jpg'

const HeavyComponent = () => {
    const [data, setData] = useState([])
    const [count, setCount] = useState(0)

    // Unnecessary API call on every render
    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get('https://jsonplaceholder.typicode.com/posts')
            setData(result.data)
        }
        fetchData()
    }, [count]) // This dependency will cause the effect to run on every count change

    // Heavy computation on every render
    const expensiveCalculation = () => {
        let result = 0
        for (let i = 0; i < 1000000; i++) {
            result += Math.random()
        }
        return result.toFixed(2)
    }

    // Creating a large array on every render
    const largeArray = new Array(10000).fill(0).map((_, index) => ({
        id: index,
        value: Math.random()
    }))

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h2>Heavy Component</h2>
            <p>Expensive Calculation Result: {expensiveCalculation()}</p>
            <p>Current Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>

            {/* Unoptimized image */}
            <img src={LargeImage} alt="Large unoptimized image" style={{width: '100%', height: 'auto'}} />

            {/* Rendering a large list inefficiently */}
            <ul>
                {largeArray.map(item => (
                    <li key={item.id}>{item.value}</li>
                ))}
            </ul>

            {/* Using heavy libraries for simple operations */}
            <p>Current Date: {moment().format('MMMM Do YYYY, h:mm:ss a')}</p>
            <p>Capitalized Title: {_.capitalize('this is a heavy component')}</p>

            {/* Rendering fetched data inefficiently */}
            <h3>Fetched Posts:</h3>
            {data.map(post => (
                <div key={post.id}>
                    <h4>{post.title}</h4>
                    <p>{post.body}</p>
                </div>
            ))}
        </motion.div>
    )
}

export default HeavyComponent
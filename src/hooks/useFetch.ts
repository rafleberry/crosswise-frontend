import { useCallback } from 'react'
import axios from 'axios'

type AxiosParam = {
  method: 'GET' | 'get' | 'POST' | 'post'
  url: string
  data?: any
}

function useFetch() {
  const fetch = ({ method, url, data }: AxiosParam) => {
    return axios({
      method: (method || '').toLowerCase(),
      url,
      headers: { 'content-type': 'application/json' },
      data,
    })
  }

  const getRequest = useCallback(async (url) => {
    try {
      const result = await fetch({
        url,
        method: 'get',
      })
      return result.data
    } catch (err) {
      console.error('axios error', err)
      return err
    }
  }, [])

  const postRequest = useCallback(async (url, data) => {
    try {
      const result = await fetch({
        url,
        method: 'post',
        data,
      })
      return result.data
    } catch (err) {
      console.error('axios error', err)
      return err
    }
  }, [])

  return {
    getRequest,
    postRequest,
  }
}

export default useFetch

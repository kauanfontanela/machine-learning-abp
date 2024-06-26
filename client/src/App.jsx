import { useState } from 'react'
import { AutoComplete, Button, DatePicker, Divider, Flex, Form, Input, Statistic, Typography } from 'antd'

const UF = [
  { value: 'AC' }, //, label: 'Acre' },
  { value: 'AL' }, //, label: 'Alagoas' },
  { value: 'AP' }, //, label: 'Amapá' },
  { value: 'AM' }, //, label: 'Amazonas' },
  { value: 'BA' }, //, label: 'Bahia' },
  { value: 'CE' }, //, label: 'Ceará' },
  { value: 'DF' }, //, label: 'Distrito Federal' },
  { value: 'ES' }, //, label: 'Espírito Santo' },
  { value: 'GO' }, //, label: 'Goiás' },
  { value: 'MA' }, //, label: 'Maranhão' },
  { value: 'MT' }, //, label: 'Mato Grosso' },
  { value: 'MS' }, //, label: 'Mato Grosso do Sul' },
  { value: 'MG' }, //, label: 'Minas Gerais' },
  { value: 'PA' }, //, label: 'Pará' },
  { value: 'PB' }, //, label: 'Paraíba' },
  { value: 'PR' }, //, label: 'Paraná' },
  { value: 'PE' }, //, label: 'Pernambuco' },
  { value: 'PI' }, //, label: 'Piauí' },
  { value: 'RJ' }, //, label: 'Rio de Janeiro' },
  { value: 'RN' }, //, label: 'Rio Grande do Norte' },
  { value: 'RS' }, //, label: 'Rio Grande do Sul' },
  { value: 'RO' }, //, label: 'Rondônia' },
  { value: 'RR' }, //, label: 'Roraima' },
  { value: 'SC' }, //, label: 'Santa Catarina' },
  { value: 'SP' }, //, label: 'São Paulo' },
  { value: 'SE' }, //, label: 'Sergipe' },
  { value: 'TO' }, //, label: 'Tocantins' }
]

function App() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)

  form.submit = async () => {
    form.validateFields().then(values => {
      console.log(values)
    }).catch(err => {
      console.error(err)
      return
    })

    const uf = form.getFieldValue('uf')
    const date = form.getFieldValue('date').format("DD/MM/YYYY")
    console.log(uf, date);

    setLoading(true)
    fetch(`api/predict?uf=${uf}&date=${date}`)
      .then(res => res.json())
      .then((v) => setResults(JSON.parse(v)))
      .then(() => setLoading(false))
  }

  return (
    <Flex justify='center' style={{ width: "100vw" }}>
      <Flex vertical style={{ width: "48rem", paddingInline: "1rem" }}>
        <Typography.Title level={2}>Minha viagem</Typography.Title>
        <Form
          form={form}
          layout='vertical'
        >
          <Form.Item
            label="Unidade Federal (UF)"
            name="uf"
            hasFeedback
            required
            rules={[
              { required: true, message: 'Informe a UF' },
              { length: 2, message: 'Informe a UF com 2 caracteres' },
              { pattern: /^[A-Z]{2}$/, message: 'Informe a UF com letras maiúsculas' },
              { validator: async (_, value) => UF.find(uf => uf.value === value) ? Promise.resolve() : Promise.reject('UF não existe') }
            ]}
          >
            <AutoComplete options={UF} filterOption={true} >
              <Input />
            </AutoComplete>
          </Form.Item>
          <Form.Item
            label="Data"
            name="date"
            required
            hasFeedback
          >
            <DatePicker
              style={{ width: '100%' }}
              format={'DD/MM/YYYY'}
            />
          </Form.Item>
        </Form>

        <Button type="primary" onClick={form.submit} loading={loading}>
          Fazer predição
        </Button>

        <Divider />

        <Statistic title="Chance de SRAG (%) - Regressão Linear" value={results ? results[0] * 100 : "-"} />
        <Statistic title="Chance de SRAG (%) - Árvore de decisão" value={results ? results[1] * 100 : "-"} />
        <Statistic title="Chance de SRAG (%) - Floresta Randômica" value={results ? results[2] * 100 : "-"} />
      </Flex>
    </Flex >
  )
}

export default App

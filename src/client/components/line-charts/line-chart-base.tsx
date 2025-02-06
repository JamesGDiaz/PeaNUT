import React, { useContext, useEffect, useState } from 'react'
import { Card, CardContent } from '@/client/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartReferenceLine,
} from '@/client/components/ui/chart'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { Payload } from 'recharts/types/component/DefaultLegendContent'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/client/components/ui/accordion'
import { LanguageContext } from '@/client/context/language'
import { useTranslation } from 'react-i18next'

type ReferenceLineData = Array<{ label: string; value: number }>

type Props = {
  id: string
  config: ChartConfig
  data: any[]
  unit: string
  onLegendClick?: (payload: Payload) => void
  referenceLineData?: ReferenceLineData
}

export default function LineChartBase(props: Props) {
  const { referenceLineData, id, config, data, unit, onLegendClick } = props
  const lng = useContext<string>(LanguageContext)
  const { t } = useTranslation(lng)
  const [accordionValue, setAccordionValue] = useState<string | undefined>(id)

  useEffect(() => {
    // Get stored state from localStorage
    const storedState = localStorage.getItem(`accordion-${id}`)
    // Set to stored value if exists, otherwise default to open (id)
    setAccordionValue(storedState === 'closed' ? undefined : id)
  }, [id])

  const handleAccordionChange = (value: string) => {
    // Store the new state in localStorage
    localStorage.setItem(`accordion-${id}`, value === id ? 'open' : 'closed')
    setAccordionValue(value)
  }

  return (
    <Card className='w-full border border-border-card bg-card p-3 shadow-none' data-testid={id}>
      <CardContent className='!p-0'>
        <Accordion
          type='single'
          collapsible
          className='w-full'
          value={accordionValue}
          onValueChange={handleAccordionChange}
        >
          <AccordionItem value={id}>
            <AccordionTrigger className='p-0'>{t(id)}</AccordionTrigger>
            <AccordionContent>
              <ChartContainer config={config} className='mx-auto aspect-square h-96 w-full'>
                <LineChart accessibilityLayer data={data}>
                  <XAxis
                    dataKey='time'
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(timeStr) =>
                      new Date(timeStr).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric',
                      })
                    }
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    domain={[
                      (dataMin: number) =>
                        referenceLineData !== undefined
                          ? Math.min(dataMin, ...referenceLineData.map((l) => l.value))
                          : dataMin,
                      (dataMax: number) =>
                        referenceLineData !== undefined
                          ? Math.max(dataMax, ...referenceLineData.map((l) => l.value))
                          : dataMax,
                    ]}
                    tickMargin={8}
                    tickFormatter={(value) => `${value}${unit}`}
                  />
                  <ChartLegend
                    verticalAlign='top'
                    content={<ChartLegendContent handleClick={(e) => onLegendClick && onLegendClick(e)} />}
                  />
                  <CartesianGrid horizontal vertical />
                  {referenceLineData &&
                    referenceLineData.map((line) => (
                      <ChartReferenceLine
                        key={line.label}
                        y={line.value}
                        stroke='red'
                        label={line.label}
                        strokeDasharray='4 4'
                      />
                    ))}
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        unit={unit}
                        labelKey='time'
                        labelFormatter={(value, payload) =>
                          new Date(payload[0].payload.time).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            second: 'numeric',
                          })
                        }
                      />
                    }
                  />
                  {data.length > 0 &&
                    Object.keys(data[0])
                      .filter((k) => k !== 'time')
                      .map((key) => (
                        <Line
                          key={key}
                          dataKey={key}
                          type='monotone'
                          stroke={`var(--color-${key})`}
                          strokeWidth={2}
                          dot={false}
                        />
                      ))}
                </LineChart>
              </ChartContainer>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}

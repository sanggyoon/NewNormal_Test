const width = 500;
const height = 500;
const margin = { top: 50, right: 50, bottom: 50, left: 50 };

// 공통 스케일 설정
const xScale = d3
  .scaleBand()
  .domain(data.map((d, i) => i))
  .range([0, width])
  .padding(0.1);

const yScale = d3
  .scaleLinear()
  .domain([0, d3.max(data, (d) => d.value) * 1.2])
  .range([height, 0]);

// SVG 크기 조정
const barSvg = d3
  .select('#barChart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

barSvg
  .selectAll('rect')
  .data(data)
  .enter()
  .append('rect')
  .attr('x', (d, i) => xScale(i))
  .attr('y', (d) => yScale(d.value))
  .attr('width', xScale.bandwidth())
  .attr('height', (d) => height - yScale(d.value))
  .attr('fill', 'steelblue');

// 막대 그래프에 값 표시
barSvg
  .selectAll('text')
  .data(data)
  .enter()
  .append('text')
  .attr('x', (d, i) => xScale(i) + xScale.bandwidth() / 2)
  .attr('y', (d) => yScale(d.value) - 5)
  .attr('text-anchor', 'middle')
  .text((d) => `${d.key}: ${d.value}`);

// 막대 그래프 x축 레이블
barSvg
  .append('text')
  .attr('x', width + 20)
  .attr('y', height + 10)
  .attr('text-anchor', 'middle')
  .style('font-size', '14px')
  .text('시간');

// 막대 그래프 y축 레이블
barSvg
  .append('text')
  .attr('x', 0)
  .attr('y', -20)
  .attr('text-anchor', 'middle')
  .style('font-size', '14px')
  .text('값');

barSvg
  .append('g')
  .attr('transform', `translate(0, ${height})`)
  .call(
    d3
      .axisBottom(xScale)
      .tickFormat((d, i) => data[i].time.toLocaleTimeString())
  );

barSvg.append('g').call(d3.axisLeft(yScale));

// 선 그래프
const lineSvg = d3
  .select('#lineChart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

const line = d3
  .line()
  .x((d, i) => xScale(i) + xScale.bandwidth() / 2)
  .y((d) => yScale(d.value));

lineSvg
  .append('path')
  .datum(data)
  .attr('fill', 'none')
  .attr('stroke', 'red')
  .attr('stroke-width', 2)
  .attr('d', line);

// 선 그래프에 값 표시
lineSvg
  .selectAll('text')
  .data(data)
  .enter()
  .append('text')
  .attr('x', (d, i) => xScale(i) + xScale.bandwidth() / 2)
  .attr('y', (d) => yScale(d.value) - 10)
  .attr('text-anchor', 'middle')
  .text((d) => `${d.key}: ${d.value}`);

// 선 그래프 x축 레이블
lineSvg
  .append('text')
  .attr('x', width + 20)
  .attr('y', height + 10)
  .attr('text-anchor', 'middle')
  .style('font-size', '14px')
  .text('시간');

// 선 그래프 y축 레이블
lineSvg
  .append('text')
  .attr('x', 0)
  .attr('y', -20)
  .attr('text-anchor', 'middle')
  .style('font-size', '14px')
  .text('값');

lineSvg
  .append('g')
  .attr('transform', `translate(0, ${height})`)
  .call(
    d3
      .axisBottom(xScale)
      .tickFormat((d, i) => data[i].time.toLocaleTimeString())
  );

lineSvg.append('g').call(d3.axisLeft(yScale));

// 원형 그래프(파이 차트)
const pieSvg = d3
  .select('#pieChart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr(
    'transform',
    `translate(${(width + margin.left + margin.right) / 2}, ${
      (height + margin.top + margin.bottom) / 2
    })`
  );

const pie = d3.pie().value((d) => d.value);
const arc = d3.arc().innerRadius(0).outerRadius(200);

const color = d3.scaleOrdinal(d3.schemeCategory10);

pieSvg
  .selectAll('path')
  .data(pie(data))
  .enter()
  .append('path')
  .attr('d', arc)
  .attr('fill', (d, i) => color(i));

// 파이 차트에 값 표시
pieSvg
  .selectAll('text')
  .data(pie(data))
  .enter()
  .append('text')
  .attr('transform', (d) => `translate(${arc.centroid(d)})`)
  .attr('text-anchor', 'middle')
  .text((d) => `${d.data.key}: ${d.data.value}`);

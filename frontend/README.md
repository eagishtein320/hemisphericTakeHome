## To Run
docker compose up

## Sensor Data Visualization

This graph displays data from 19 sensors on a user, sampled at a rate of 120Hz. Each sensor’s data is aggregated using an **Exponential Moving Average (EMA)**. This method was chosen to smooth the readings and highlight long-term trends, as opposed to using a simple average, which might include false positives, sudden movements, meaningless fluctuations, or outliers. EMA reduces noise and provides a clearer picture of the sensor’s behavior over time.

### Future Enhancements

- **Comparing Users:** It would be valuable to compare sensor readings between multiple users. This feature would allow for visualizing how sensor data varies across different individuals.
  
- **Sensor-Specific Views:** Another potential view is to focus on a single sensor’s data across all users. For example, it would be interesting to compare readings for sensor 1 across different users.

- **Correlation Analysis:** Understanding how sensors correlate with one another could provide additional insights. For instance, do sensors 1 and 5 spike at the same time, or are they opposites? Exploring these correlations could reveal patterns in user behavior or sensor performance.

### Potential Improvements

Given more time, the following features would enhance the visualizations:

1. **User and Sensor Overlay:** Allowing users to select multiple users and sensors to overlay on the same graph would make it easier to gain insights into sensor behavior across users.
  
2. **Dynamic Aggregation Selection:** Adding a tab to let users choose which aggregation method to apply would make the graph more flexible. The graph could then dynamically update to display the selected aggregation (e.g., moving average, median, etc.).

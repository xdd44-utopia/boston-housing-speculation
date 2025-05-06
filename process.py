import pandas as pd

def process_sales_data(input_file, output_file):
    # Read the CSV file
    df = pd.read_csv(input_file)
    
    # Group by city and calculate sums and ratio
    city_summary = df.groupby('city').agg({
        'total_sales': 'sum',
        'corporate_sales': 'sum'
    }).reset_index()
    
    # Calculate corporate sale ratio
    city_summary['corporate_sale_ratio'] = city_summary['corporate_sales'] / city_summary['total_sales']
    
    # Round the ratio to 4 decimal places for readability
    city_summary['corporate_sale_ratio'] = city_summary['corporate_sale_ratio'].round(4)

    df['price_weighted'] = df['avg_price'] * df['total_sales']
    
    # Group by city and calculate the sum of weighted prices and total sales
    weighted_avg = df.groupby('city').agg(
        weighted_price_sum=('price_weighted', 'sum'),
        total_sales_sum=('total_sales', 'sum')
    ).reset_index()
    
    # Calculate weighted average
    weighted_avg['weighted_avg_price'] = weighted_avg['weighted_price_sum'] / weighted_avg['total_sales_sum']

    print(weighted_avg)
    
    result = pd.DataFrame({
        'city': city_summary['city'],
        'corporate_sale_ratio': city_summary['corporate_sale_ratio'],
        'weighted_avg_price': weighted_avg['weighted_avg_price']
    })
    result.to_csv(output_file, index=False)
    
    print(f"Summary data has been saved to {output_file}")

if __name__ == "__main__":
    input_file = "./files/ownership_and_vacancy_over_time.csv"  # Change this to your input file name
    output_file = "./files/ownership.csv"  # Change this to your desired output file name
    
    process_sales_data(input_file, output_file)